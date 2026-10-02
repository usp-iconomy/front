/** Refresh this long before expiry: proxy refreshes while the old token still covers the current request. */
export const REFRESH_MARGIN_SECONDS = 60

const REFRESH_TIMEOUT_MS = 10_000

export type SessionTokens = {
  accessToken: string
  refreshToken: string
  idToken: string
  /** Unix seconds. */
  expiresAt: number
  error?: 'RefreshFailed'
}

export function shouldRefresh(expiresAt: number, nowSeconds: number): boolean {
  return nowSeconds >= expiresAt - REFRESH_MARGIN_SECONDS
}

type TokenResponse = { access_token?: unknown; refresh_token?: string; id_token?: string; expires_in?: unknown }

/** Refresh-token grant against Keycloak with the public client (no secret). */
export async function refreshTokens(
  tokens: SessionTokens,
  options: { tokenEndpoint: string; clientId: string; nowSeconds: number; fetchImpl?: typeof fetch },
): Promise<SessionTokens> {
  const fetchImpl = options.fetchImpl ?? fetch
  const failed = (reason: string): SessionTokens => {
    console.warn(`[auth] token refresh failed: ${reason}`)
    return { ...tokens, error: 'RefreshFailed' }
  }
  try {
    const response = await fetchImpl(options.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: options.clientId,
        refresh_token: tokens.refreshToken,
      }),
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    })
    if (!response.ok) return failed(`HTTP ${response.status}`)
    const body = (await response.json()) as TokenResponse
    if (typeof body.access_token !== 'string' || typeof body.expires_in !== 'number' || !Number.isFinite(body.expires_in)) {
      return failed(`HTTP ${response.status} without access_token or expires_in`)
    }
    return {
      accessToken: body.access_token,
      // Keycloak may rotate the refresh token; keep the old one when it does not.
      refreshToken: body.refresh_token ?? tokens.refreshToken,
      idToken: body.id_token ?? tokens.idToken,
      expiresAt: options.nowSeconds + body.expires_in,
    }
  } catch (error) {
    // By name, not instanceof: a timeout rejects with a DOMException, which is not an Error in every realm.
    const name = (error as { name?: unknown } | null)?.name
    return failed(typeof name === 'string' ? name : 'unknown error')
  }
}

/** What `/api/auth/session` may show: identity and error state, never a token. */
export function publicSession(token: { name?: string | null; email?: string | null; error?: string }) {
  return { user: { name: token.name ?? null, email: token.email ?? null }, error: token.error }
}
