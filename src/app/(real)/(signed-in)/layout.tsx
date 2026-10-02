import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { requireMemberStatus } from '../member-status'

/** Every real screen except onboarding: a member without a role cannot get past here. */
export default async function SignedInLayout({ children }: { children: ReactNode }) {
  const { onboardingRequired } = await requireMemberStatus()
  if (onboardingRequired) redirect('/onboarding')
  return children
}
