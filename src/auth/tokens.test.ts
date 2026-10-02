import { describe, expect, it, vi } from 'vitest'
import { REFRESH_MARGIN_SECONDS, publicSession, refreshTokens, shouldRefresh, type SessionTokens } from './tokens'

const tokens: SessionTokens = {
  accessToken: 'old-access',
  refreshToken: 'old-refresh',
  idToken: 'old-id',
  expiresAt: 1_000,
}

const options = {
  tokenEndpoint: 'http://localhost:8080/realms/iconomy/protocol/openid-connect/token',
  clientId: 'iconomy-web',
  nowSeconds: 2_000,
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('shouldRefresh', () => {
  it('waits until the refresh margin before expiry', () => {
    expect(REFRESH_MARGIN_SECONDS).toBe(60)
    expect(shouldRefresh(1_000, 1_000 - 61)).toBe(false)
  })

  it('refreshes from the margin onwards, including after expiry', () => {
    expect(shouldRefresh(1_000, 1_000 - 60)).toBe(true)
    expect(shouldRefresh(1_000, 1_000)).toBe(true)
    expect(shouldRefresh(1_000, 1_500)).toBe(true)
  })
})

describe('refreshTokens', () => {
  it('posts the refresh grant for the public client, without a secret', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse({ access_token: 'new-access', refresh_token: 'new-refresh', id_token: 'new-id', expires_in: 300 }),
    )

    await refreshTokens(tokens, { ...options, fetchImpl })

    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const [url, init] = fetchImpl.mock.calls[0]!
    expect(url).toBe(options.tokenEndpoint)
    expect(init?.method).toBe('POST')
    const body = new URLSearchParams(String(init?.body))
    expect(body.get('grant_type')).toBe('refresh_token')
    expect(body.get('client_id')).toBe('iconomy-web')
    expect(body.get('refresh_token')).toBe('old-refresh')
    expect(body.has('client_secret')).toBe(false)
    expect(JSON.stringify(init?.headers ?? {})).not.toMatch(/authorization/i)
  })

  it('maps expires_in onto the current time', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse({ access_token: 'new-access', refresh_token: 'new-refresh', id_token: 'new-id', expires_in: 300 }),
    )

    const refreshed = await refreshTokens(tokens, { ...options, fetchImpl })

    expect(refreshed).toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      idToken: 'new-id',
      expiresAt: 2_300,
    })
  })

  it('keeps the old refresh and id tokens when Keycloak does not rotate them', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ access_token: 'new-access', expires_in: 300 }))

    const refreshed = await refreshTokens(tokens, { ...options, fetchImpl })

    expect(refreshed.refreshToken).toBe('old-refresh')
    expect(refreshed.idToken).toBe('old-id')
    expect(refreshed.error).toBeUndefined()
  })

  it('marks the session as failed when Keycloak rejects the refresh token', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ error: 'invalid_grant' }, 400))

    const refreshed = await refreshTokens(tokens, { ...options, fetchImpl })

    expect(refreshed).toEqual({ ...tokens, error: 'RefreshFailed' })
  })

  it('marks the session as failed when Keycloak is unreachable', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('fetch failed'))

    const refreshed = await refreshTokens(tokens, { ...options, fetchImpl })

    expect(refreshed).toEqual({ ...tokens, error: 'RefreshFailed' })
  })
})

describe('publicSession', () => {
  it('exposes identity and error state, never a token', () => {
    const jwt = { name: 'Ana', email: 'ana@usp.br', ...tokens, error: 'RefreshFailed' }

    const session = publicSession(jwt)

    expect(session).toEqual({ user: { name: 'Ana', email: 'ana@usp.br' }, error: 'RefreshFailed' })
    const serialized = JSON.stringify(session)
    for (const key of ['accessToken', 'refreshToken', 'idToken', 'expiresAt']) {
      expect(serialized).not.toContain(key)
    }
    for (const value of ['old-access', 'old-refresh', 'old-id']) {
      expect(serialized).not.toContain(value)
    }
  })

  it('fills missing identity fields with null', () => {
    expect(publicSession({})).toEqual({ user: { name: null, email: null }, error: undefined })
  })
})
