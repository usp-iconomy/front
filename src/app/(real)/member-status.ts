import 'server-only'
import { redirect } from 'next/navigation'
import { ApiError } from '@/data/api/client'
import { getMemberStatus } from '@/data/api/source'

export const SESSION_EXPIRED_PATH = '/?reason=session-expired'

/** The API refused the account (403, a disabled account): the route renders `AccessRestrictedScreen`. */
export const FORBIDDEN = Symbol('forbidden')

/**
 * Settles an API read for a layout or page. A 401 goes to the entry page and a 403 becomes `FORBIDDEN`;
 * anything else reaches error.tsx, which only sees a digest in production and cannot tell them apart.
 */
export async function guardApiRead<T>(read: Promise<T>): Promise<T | typeof FORBIDDEN> {
  try {
    return await read
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(SESSION_EXPIRED_PATH)
    if (error instanceof ApiError && error.status === 403) return FORBIDDEN
    throw error
  }
}

/** The signed-in member, `FORBIDDEN`, or a redirect to the entry page when the API no longer accepts the session. */
export function requireMemberStatus() {
  return guardApiRead(getMemberStatus())
}
