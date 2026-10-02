import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { OnboardingScreen } from '@/screens/OnboardingScreen'
import { requireMemberStatus } from '../member-status'
import { chooseRoleAction } from './actions'

export const metadata: Metadata = { title: 'Primeiro acesso — USP Iconomy' }

export default async function OnboardingPage() {
  const { onboardingRequired } = await requireMemberStatus()
  if (!onboardingRequired) redirect('/courses')
  return <OnboardingScreen action={chooseRoleAction} />
}
