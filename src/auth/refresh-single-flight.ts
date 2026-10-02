import type { SessionTokens } from './tokens'

/** How long a failed refresh is handed out before the next request may try the refresh token again. */
export const FAILED_REUSE_MS = 30_000
/** Upper bound on how long a successful refresh is kept, whatever the access token's lifetime. */
export const SUCCESS_REUSE_CAP_MS = 60 * 60 * 1000

type Flight = { promise: Promise<SessionTokens>; keepUntil?: number }

function keepUntil(result: SessionTokens, settledAt: number): number {
  if (result.error) return settledAt + FAILED_REUSE_MS
  return Math.min(result.expiresAt * 1000, settledAt + SUCCESS_REUSE_CAP_MS)
}

/**
 * The realm revokes a refresh token on first use, so parallel requests after expiry must share one
 * refresh or all but one end as RefreshFailed. In-process only: several instances need a shared store.
 * A success is kept until its access token expires: a late response can put the old cookie back in the browser.
 */
export function createSingleFlightRefresh(
  refresh: (tokens: SessionTokens) => Promise<SessionTokens>,
  now: () => number = Date.now,
): (tokens: SessionTokens) => Promise<SessionTokens> {
  const flights = new Map<string, Flight>()

  return (tokens) => {
    const at = now()
    for (const [refreshToken, flight] of flights) {
      if (flight.keepUntil !== undefined && at > flight.keepUntil) flights.delete(refreshToken)
    }
    const existing = flights.get(tokens.refreshToken)
    if (existing) return existing.promise

    const flight: Flight = {
      promise: refresh(tokens).then(
        (result) => {
          flight.keepUntil = keepUntil(result, now())
          return result
        },
        (error: unknown) => {
          flight.keepUntil = now() + FAILED_REUSE_MS
          throw error
        },
      ),
    }
    flights.set(tokens.refreshToken, flight)
    return flight.promise
  }
}
