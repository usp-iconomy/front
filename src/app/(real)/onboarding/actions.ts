'use server'

import { redirect } from 'next/navigation'
import { ApiError } from '@/data/api/client'
import { chooseRole } from '@/data/api/source'
import type { OnboardingRole, OnboardingState } from '@/screens/OnboardingScreen'
import { SESSION_EXPIRED_PATH } from '../member-status'

const roles: ReadonlySet<string> = new Set<OnboardingRole>(['student', 'teacher', 'donor'])

function isOnboardingRole(value: FormDataEntryValue | null): value is OnboardingRole {
  return typeof value === 'string' && roles.has(value)
}

export async function chooseRoleAction(_state: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const role = formData.get('role')
  if (!isOnboardingRole(role)) return { error: 'Escolha um perfil para continuar.' }

  try {
    await chooseRole(role)
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    if (error.status === 401) redirect(SESSION_EXPIRED_PATH)
    // 409: the role was already chosen, say in another tab. Onboarding is over either way.
    if (error.status === 409) redirect('/courses')
    if (error.status === 422) return { error: error.detail || 'Não foi possível salvar esse perfil.' }
    throw error
  }
  // Never re-read the member here: /auth/me is memoized for this request and still says onboardingRequired.
  redirect('/courses')
}
