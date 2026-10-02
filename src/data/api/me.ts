export type ApiUser = {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin' | 'donor' | null
  isInstitutional: boolean
  createdAt: string
}
export type ApiCurrentUser = { user: ApiUser; onboardingRequired: boolean; emailVerified: boolean }
