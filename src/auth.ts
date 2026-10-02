import NextAuth from 'next-auth'
import Keycloak from 'next-auth/providers/keycloak'
import { publicSession, refreshTokens, shouldRefresh, type SessionTokens } from '@/auth/tokens'
import { isPublicPath, safeRedirect } from '@/auth/routes'

const issuer = process.env.AUTH_KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/iconomy'
const clientId = process.env.AUTH_KEYCLOAK_ID ?? 'iconomy-web'

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      return Boolean(session?.user) && !session?.error
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
      const refreshed = await refreshTokens(tokens, {
        tokenEndpoint: `${issuer}/protocol/openid-connect/token`,
        clientId,
        nowSeconds: now,
      })
      return { ...token, ...refreshed }
    },
    session({ token }) {
      return publicSession(token as { name?: string; email?: string; error?: string }) as never
    },
    redirect({ url, baseUrl }) {
      // Allows Keycloak's end-session endpoint as the sign-out destination.
      return safeRedirect(url, baseUrl, issuer)
    },
  },
})
