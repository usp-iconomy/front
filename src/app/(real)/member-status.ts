import 'server-only'
import { redirect } from 'next/navigation'
import { ApiError } from '@/data/api/client'
import { getMemberStatus } from '@/data/api/source'

export const SESSION_EXPIRED_PATH = '/?reason=session-expired'

/** The signed-in member, or a redirect to the entry page when the API no longer accepts the session. */
export async function requireMemberStatus() {
  try {
    return await getMemberStatus()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(SESSION_EXPIRED_PATH)
    throw error
  }
}
