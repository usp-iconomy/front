import { describe, expect, it } from 'vitest'
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
