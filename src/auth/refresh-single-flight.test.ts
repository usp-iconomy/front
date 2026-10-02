import { describe, expect, it, vi } from 'vitest'
import { createSingleFlightRefresh, FAILED_REUSE_MS, SUCCESS_REUSE_CAP_MS } from './refresh-single-flight'
import type { SessionTokens } from './tokens'

const session = (refreshToken: string): SessionTokens => ({
  accessToken: `access-for-${refreshToken}`,
  refreshToken,
  idToken: 'id',
  expiresAt: 1_000,
})

/** `expiresAt` of the refreshed tokens, in Unix seconds; the clock starts at 0 ms. */
function setup(expiresAt = 600) {
  const clock = { now: 0 }
  let call = 0
  const refresh = vi.fn(async (tokens: SessionTokens): Promise<SessionTokens> => {
    call += 1
    return { ...tokens, accessToken: `new-access-${call}`, refreshToken: `rotated-${call}`, expiresAt }
  })
  const refreshOnce = createSingleFlightRefresh(refresh, () => clock.now)
  return { clock, refresh, refreshOnce }
}

describe('createSingleFlightRefresh', () => {
  it('sends one refresh to Keycloak for concurrent requests holding the same refresh token', async () => {
    const { refresh, refreshOnce } = setup()

    const [first, second] = await Promise.all([refreshOnce(session('r1')), refreshOnce(session('r1'))])

    expect(refresh).toHaveBeenCalledTimes(1)
    expect(second).toEqual(first)
    expect(first.accessToken).toBe('new-access-1')
  })

  it('refreshes separately for a different refresh token', async () => {
    const { refresh, refreshOnce } = setup()

    const [first, second] = await Promise.all([refreshOnce(session('r1')), refreshOnce(session('r2'))])

    expect(refresh).toHaveBeenCalledTimes(2)
    expect(first.accessToken).not.toBe(second.accessToken)
  })

  it('hands one failed refresh to every concurrent caller instead of retrying the consumed token', async () => {
    const refresh = vi.fn(async (tokens: SessionTokens): Promise<SessionTokens> => ({ ...tokens, error: 'RefreshFailed' }))
    const refreshOnce = createSingleFlightRefresh(refresh, () => 0)

    const results = await Promise.all([refreshOnce(session('r1')), refreshOnce(session('r1'))])
    const later = await refreshOnce(session('r1'))

    expect(refresh).toHaveBeenCalledTimes(1)
    for (const result of [...results, later]) expect(result.error).toBe('RefreshFailed')
  })

  it('hands a successful refresh to late requests until the new access token expires', async () => {
    const { clock, refresh, refreshOnce } = setup(600)
    const first = await refreshOnce(session('r1'))

    clock.now = 600_000
    expect(await refreshOnce(session('r1'))).toEqual(first)
    expect(refresh).toHaveBeenCalledTimes(1)

    clock.now = 600_001
    expect((await refreshOnce(session('r1'))).accessToken).toBe('new-access-2')
    expect(refresh).toHaveBeenCalledTimes(2)
  })

  it('keeps a successful refresh for at most an hour, however long the token lives', async () => {
    const { clock, refresh, refreshOnce } = setup(86_400)
    const first = await refreshOnce(session('r1'))

    clock.now = SUCCESS_REUSE_CAP_MS
    expect(await refreshOnce(session('r1'))).toEqual(first)

    clock.now = SUCCESS_REUSE_CAP_MS + 1
    await refreshOnce(session('r1'))
    expect(refresh).toHaveBeenCalledTimes(2)
  })

  it('keeps a failed refresh for 30 seconds', async () => {
    const clock = { now: 0 }
    const refresh = vi.fn(async (tokens: SessionTokens): Promise<SessionTokens> => ({ ...tokens, error: 'RefreshFailed' }))
    const refreshOnce = createSingleFlightRefresh(refresh, () => clock.now)
    await refreshOnce(session('r1'))

    expect(FAILED_REUSE_MS).toBe(30_000)
    clock.now = FAILED_REUSE_MS
    await refreshOnce(session('r1'))
    expect(refresh).toHaveBeenCalledTimes(1)

    clock.now = FAILED_REUSE_MS + 1
    await refreshOnce(session('r1'))
    expect(refresh).toHaveBeenCalledTimes(2)
  })

  it('retries a refresh that threw once the failure window is over', async () => {
    const clock = { now: 0 }
    const refresh = vi.fn(async (): Promise<SessionTokens> => {
      throw new Error('boom')
    })
    const refreshOnce = createSingleFlightRefresh(refresh, () => clock.now)
    await expect(refreshOnce(session('r1'))).rejects.toThrow('boom')

    clock.now = FAILED_REUSE_MS + 1
    await expect(refreshOnce(session('r1'))).rejects.toThrow('boom')
    expect(refresh).toHaveBeenCalledTimes(2)
  })
})
