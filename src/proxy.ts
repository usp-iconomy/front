import type { NextFetchEvent, NextRequest } from 'next/server'
import { auth } from '@/auth'
import { forwardSessionCookies } from '@/auth/forward-cookies-response'

// Called with (request, event), `auth` runs `authorized` and the `jwt` refresh; its types only describe the wrapper form.
const authProxy = auth as unknown as (request: NextRequest, event: NextFetchEvent) => Promise<Response>

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  return forwardSessionCookies(request, await authProxy(request, event))
}

export const config = {
  // Skip Next internals and static files; Auth.js decides the rest through `authorized`.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)'],
}
