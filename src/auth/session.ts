import 'server-only'
import { getToken } from 'next-auth/jwt'
import { headers } from 'next/headers'
import type { SessionTokens } from './tokens'

async function readTokens(): Promise<Partial<SessionTokens> | null> {
  const token = await getToken({
    req: { headers: await headers() },
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
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
