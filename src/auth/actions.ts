'use server'

import { signIn, signOut } from '@/auth'
import { clientId, endSessionEndpoint } from './config'
import { safeNextPath } from './routes'
import { getIdToken } from './session'

export async function signInAction(formData: FormData) {
  await signIn('keycloak', { redirectTo: safeNextPath(formData.get('next')) })
}

/** Opens Keycloak's registration screen instead of the login one. */
export async function signUpAction() {
  await signIn('keycloak', { redirectTo: '/onboarding' }, { prompt: 'create' })
}

/** Ends the Auth.js session and the Keycloak SSO session, so "Entrar" asks for the password again. */
export async function signOutAction() {
  const idToken = await getIdToken()
  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000'
  const endSession = new URL(endSessionEndpoint)
  endSession.searchParams.set('post_logout_redirect_uri', new URL('/', baseUrl).toString())
  endSession.searchParams.set('client_id', clientId)
  if (idToken) endSession.searchParams.set('id_token_hint', idToken)
  await signOut({ redirectTo: endSession.toString() })
}
