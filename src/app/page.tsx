import { auth } from '@/auth'
import { signInAction, signOutAction, signUpAction } from '@/auth/actions'
import { nextFromCallbackUrl } from '@/auth/routes'
import { EntryScreen } from '@/screens/EntryScreen'

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const [session, { reason, callbackUrl, error }] = await Promise.all([auth(), searchParams])
  const sessionExpired = reason === 'session-expired'
  // A session that failed to refresh, or that the API rejected with 401, must not offer "Continuar como": it would loop back here.
  const signedIn = Boolean(session?.user) && !session?.error && !sessionExpired
  const member = signedIn ? { name: session?.user?.name ?? session?.user?.email ?? null } : null
  const appOrigin = process.env.AUTH_URL ?? 'http://localhost:3000'

  return (
    <EntryScreen
      member={member}
      sessionExpired={sessionExpired}
      signInFailed={error !== undefined}
      next={nextFromCallbackUrl(callbackUrl, appOrigin)}
      actions={{ signIn: signInAction, signUp: signUpAction, signOut: signOutAction }}
    />
  )
}
