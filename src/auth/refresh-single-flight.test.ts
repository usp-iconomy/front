import { describe, expect, it, vi } from 'vitest'
import { createSingleFlightRefresh, REUSE_WINDOW_MS } from './refresh-single-flight'
import type { SessionTokens } from './tokens'

const session = (refreshToken: string): SessionTokens => ({
  accessToken: `access-for-${refreshToken}`,
  refreshToken,
  idToken: 'id',
  expiresAt: 1_000,
})

function setup() {
  const clock = { now: 0 }
  let call = 0
  const refresh = vi.fn(async (tokens: SessionTokens): Promise<SessionTokens> => {
    call += 1
    return { ...tokens, accessToken: `new-access-${call}`, refreshToken: `rotated-${call}`, expiresAt: 2_000 }
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

  it('hands the settled result to a request arriving just after, within the reuse window', async () => {
    const { clock, refresh, refreshOnce } = setup()
    const first = await refreshOnce(session('r1'))

    clock.now += REUSE_WINDOW_MS
    expect(await refreshOnce(session('r1'))).toEqual(first)
    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('forgets the result after the reuse window', async () => {
    const { clock, refresh, refreshOnce } = setup()
    await refreshOnce(session('r1'))

    clock.now += REUSE_WINDOW_MS + 1
    const later = await refreshOnce(session('r1'))

    expect(refresh).toHaveBeenCalledTimes(2)
    expect(later.accessToken).toBe('new-access-2')
  })
})
