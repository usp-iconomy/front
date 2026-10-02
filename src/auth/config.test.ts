import { describe, expect, it, vi } from 'vitest'
import { authConfig } from './config'

describe('authConfig.callbacks.session', () => {
  it('serves identity only, never a token, from a JWT that carries all of them', async () => {
    const token = {
      name: 'Ana',
      email: 'ana@usp.br',
      sub: 'kc-user-1',
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      idToken: 'id-1',
      expiresAt: 9_999_999_999,
    }
    const session = { user: { name: 'Ana', email: 'ana@usp.br' }, expires: '2026-10-03T00:00:00.000Z' }

    const result = await authConfig.callbacks.session({ session, token } as never)

    const serialized = JSON.stringify(result)
    for (const key of ['accessToken', 'refreshToken', 'idToken', 'expiresAt']) expect(serialized).not.toContain(key)
    for (const value of ['access-1', 'refresh-1', 'id-1']) expect(serialized).not.toContain(value)
    expect(result).toEqual({ user: { name: 'Ana', email: 'ana@usp.br' } })
  })

  it('passes a failed refresh through so the UI can send the user back to sign-in', async () => {
    const token = { name: 'Ana', email: 'ana@usp.br', accessToken: 'access-1', error: 'RefreshFailed' }

    const result = await authConfig.callbacks.session({ session: {}, token } as never)

    expect(result).toEqual({ user: { name: 'Ana', email: 'ana@usp.br' }, error: 'RefreshFailed' })
  })
})

describe('authConfig.callbacks.authorized', () => {
  const authorized = (session: unknown, url: string) =>
    authConfig.callbacks.authorized({ auth: session, request: { nextUrl: new URL(url) } } as never)

  it('lets anyone into public paths', () => {
    expect(authorized(null, 'http://localhost:3000/demo/courses')).toBe(true)
  })

  it('lets a signed-in member into the real tree and turns everyone else away', () => {
    expect(authorized({ user: { name: 'Ana' } }, 'http://localhost:3000/courses')).toBe(true)
    expect(authorized(null, 'http://localhost:3000/courses')).toBe(false)
  })

  it('sends a session whose refresh failed to the entry page with the expiry notice', () => {
    const result = authorized(
      { user: { name: 'Ana' }, error: 'RefreshFailed' },
      'http://localhost:3000/profile?tab=wallet',
    )

    expect(result).toBeInstanceOf(Response)
    const location = new URL((result as Response).headers.get('location')!)
    expect(location.origin).toBe('http://localhost:3000')
    expect(location.pathname).toBe('/')
    expect(location.searchParams.get('reason')).toBe('session-expired')
    expect(location.searchParams.get('callbackUrl')).toBe('http://localhost:3000/profile?tab=wallet')
  })
})

describe('authConfig.callbacks.jwt', () => {
  it('refreshes once for concurrent requests that carry the same expired session', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () =>
        new Response(JSON.stringify({ access_token: 'access-2', refresh_token: 'refresh-2', expires_in: 900 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    )
    const token = { accessToken: 'access-1', refreshToken: 'concurrent-refresh-1', idToken: 'id-1', expiresAt: 1 }

    const [first, second] = await Promise.all([
      authConfig.callbacks.jwt({ token: { ...token } } as never),
      authConfig.callbacks.jwt({ token: { ...token } } as never),
    ])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(first).toMatchObject({ accessToken: 'access-2', refreshToken: 'refresh-2' })
    expect(second).toEqual(first)
    fetchMock.mockRestore()
  })
})
