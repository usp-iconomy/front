import 'server-only'
import { getToken } from 'next-auth/jwt'
import { headers } from 'next/headers'
import type { SessionTokens } from './tokens'

/** Mirrors how Auth.js names the cookie it writes: AUTH_URL's (or NEXTAUTH_URL's) scheme wins, else the forwarded one. */
function usesSecureCookie(requestHeaders: Headers): boolean {
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (authUrl) return authUrl.startsWith('https://')
  return requestHeaders.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https'
}

async function readTokens(): Promise<Partial<SessionTokens> | null> {
  const requestHeaders = await headers()
  const token = await getToken({
    req: { headers: requestHeaders },
    secret: process.env.AUTH_SECRET,
    secureCookie: usesSecureCookie(requestHeaders),
  })
  return token as Partial<SessionTokens> | null
}

/** The Keycloak access token for calling the API. Null without a usable session. */
export async function getAccessToken(): Promise<string | null> {
  const tokens = await readTokens()
  if (!tokens?.accessToken || tokens.error) return null
  return tokens.accessToken
}

export async function getIdToken(): Promise<string | null> {
  return (await readTokens())?.idToken ?? null
}
