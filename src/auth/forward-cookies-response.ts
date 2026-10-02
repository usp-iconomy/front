import { NextResponse } from 'next/server'
import { isSessionCookie, mergeSetCookiesIntoCookieHeader } from './forward-cookies'

/**
 * Auth.js writes a refreshed session only to the browser. Pages in the same request read the
 * request's `cookie` header, so without this they would call the API with the token just replaced.
 */
export function forwardSessionCookies(request: Request, authResponse: Response): Response {
  if (authResponse.headers.has('location') || !authResponse.headers.has('x-middleware-next')) return authResponse
  const setCookies = authResponse.headers.getSetCookie()
  if (!setCookies.some(isSessionCookie)) return authResponse

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('cookie', mergeSetCookiesIntoCookieHeader(request.headers.get('cookie'), setCookies))
  const forwarded = NextResponse.next({ request: { headers: requestHeaders } })
  for (const [name, value] of authResponse.headers) {
    if (name !== 'set-cookie' && !forwarded.headers.has(name)) forwarded.headers.set(name, value)
  }
  for (const setCookie of setCookies) forwarded.headers.append('set-cookie', setCookie)
  return forwarded
}
