import { auth } from '@/auth'
import { signInAction, signOutAction, signUpAction } from '@/auth/actions'
import { nextFromCallbackUrl } from '@/auth/routes'
import { EntryScreen } from '@/screens/EntryScreen'

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const [session, { reason, callbackUrl }] = await Promise.all([auth(), searchParams])
  // A session whose refresh failed is an expired one: it must not offer "Continuar como".
  const signedIn = Boolean(session?.user) && !session?.error
  const memberName = signedIn ? (session?.user?.name ?? session?.user?.email ?? null) : null
  const appOrigin = process.env.AUTH_URL ?? 'http://localhost:3000'

  return (
    <EntryScreen
      memberName={memberName}
      sessionExpired={reason === 'session-expired'}
      next={nextFromCallbackUrl(callbackUrl, appOrigin)}
      actions={{ signIn: signInAction, signUp: signUpAction, signOut: signOutAction }}
    />
  )
}
