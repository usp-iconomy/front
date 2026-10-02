import type { NextAuthConfig, Session } from 'next-auth'
import Keycloak from 'next-auth/providers/keycloak'
import { isPublicPath, safeRedirect } from './routes'
import { publicSession, refreshTokens, shouldRefresh, type SessionTokens } from './tokens'

export const issuer = process.env.AUTH_KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/iconomy'
export const clientId = process.env.AUTH_KEYCLOAK_ID ?? 'iconomy-web'
export const tokenEndpoint = `${issuer}/protocol/openid-connect/token`
export const endSessionEndpoint = `${issuer}/protocol/openid-connect/logout`

export const authConfig = {
  providers: [
    Keycloak({
      issuer,
      clientId,
      // iconomy-web is a public client: PKCE, no secret.
      client: { token_endpoint_auth_method: 'none' },
      checks: ['pkce', 'state'],
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  callbacks: {
    authorized({ auth: session, request }) {
      if (isPublicPath(request.nextUrl.pathname)) return true
      if (session?.error) {
        // A dead refresh token is an expired session, not an anonymous visit: the entry page says so.
        const entry = new URL('/', request.nextUrl.origin)
        entry.searchParams.set('reason', 'session-expired')
        entry.searchParams.set('callbackUrl', request.nextUrl.href)
        return Response.redirect(entry, 307)
      }
      return Boolean(session?.user)
    },
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt: account.expires_at,
        }
      }
      const tokens = token as unknown as SessionTokens
      if (!tokens.expiresAt || tokens.error) return token
      const now = Math.floor(Date.now() / 1000)
      if (!shouldRefresh(tokens.expiresAt, now)) return token
      const refreshed = await refreshTokens(tokens, { tokenEndpoint, clientId, nowSeconds: now })
      return { ...token, ...refreshed }
    },
    session({ token }) {
      // No `expires`: the public session is identity and error state only.
      return publicSession(token as { name?: string; email?: string; error?: string }) as Session
    },
    redirect({ url, baseUrl }) {
      return safeRedirect(url, baseUrl, endSessionEndpoint)
    },
  },
} satisfies NextAuthConfig
