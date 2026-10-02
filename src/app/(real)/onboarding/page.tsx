import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { signOutAction } from '@/auth/actions'
import { AccessRestrictedScreen } from '@/screens/AccessRestrictedScreen'
import { OnboardingScreen } from '@/screens/OnboardingScreen'
import { FORBIDDEN, requireMemberStatus } from '../member-status'
import { chooseRoleAction } from './actions'

export const metadata: Metadata = { title: 'Primeiro acesso — USP Iconomy' }

export default async function OnboardingPage() {
  const status = await requireMemberStatus()
  if (status === FORBIDDEN) return <AccessRestrictedScreen signOut={signOutAction} />
  if (!status.onboardingRequired) redirect('/courses')
  return <OnboardingScreen action={chooseRoleAction} />
}
