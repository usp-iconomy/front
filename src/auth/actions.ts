'use server'

import { signIn, signOut } from '@/auth'
import { getIdToken } from './session'

const issuer = process.env.AUTH_KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/iconomy'

export async function signInAction(formData: FormData) {
  const next = String(formData.get('next') ?? '/courses')
  await signIn('keycloak', { redirectTo: next.startsWith('/') ? next : '/courses' })
}

/** Opens Keycloak's registration screen instead of the login one. */
export async function signUpAction() {
  await signIn('keycloak', { redirectTo: '/onboarding' }, { prompt: 'create' })
}

/** Ends the Auth.js session and the Keycloak SSO session, so "Entrar" asks for the password again. */
export async function signOutAction() {
  const idToken = await getIdToken()
  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000'
  const endSession = new URL(`${issuer}/protocol/openid-connect/logout`)
  endSession.searchParams.set('post_logout_redirect_uri', `${baseUrl}/`)
  endSession.searchParams.set('client_id', process.env.AUTH_KEYCLOAK_ID ?? 'iconomy-web')
  if (idToken) endSession.searchParams.set('id_token_hint', idToken)
  await signOut({ redirectTo: endSession.toString() })
}
