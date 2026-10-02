import type { SessionTokens } from './tokens'

/** How long a settled refresh is handed to requests that still carry the refresh token it consumed. */
export const REUSE_WINDOW_MS = 30_000

type Flight = { promise: Promise<SessionTokens>; settledAt?: number }

/**
 * The realm revokes a refresh token on first use, so parallel requests after expiry must share one
 * refresh or all but one end as RefreshFailed. In-process only: several instances need a shared store.
 */
export function createSingleFlightRefresh(
  refresh: (tokens: SessionTokens) => Promise<SessionTokens>,
  now: () => number = Date.now,
): (tokens: SessionTokens) => Promise<SessionTokens> {
  const flights = new Map<string, Flight>()

  return (tokens) => {
    const at = now()
    for (const [refreshToken, flight] of flights) {
      if (flight.settledAt !== undefined && at - flight.settledAt > REUSE_WINDOW_MS) flights.delete(refreshToken)
    }
    const existing = flights.get(tokens.refreshToken)
    if (existing) return existing.promise

    const flight: Flight = {
      promise: refresh(tokens).finally(() => {
        flight.settledAt = now()
      }),
    }
    flights.set(tokens.refreshToken, flight)
    return flight.promise
  }
}
