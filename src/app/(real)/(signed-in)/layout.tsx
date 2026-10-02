import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { signOutAction } from '@/auth/actions'
import { AccessRestrictedScreen } from '@/screens/AccessRestrictedScreen'
import { FORBIDDEN, requireMemberStatus } from '../member-status'

/** Every real screen except onboarding: a member without a role cannot get past here. */
export default async function SignedInLayout({ children }: { children: ReactNode }) {
  const status = await requireMemberStatus()
  if (status === FORBIDDEN) return <AccessRestrictedScreen signOut={signOutAction} />
  if (status.onboardingRequired) redirect('/onboarding')
  return children
}
