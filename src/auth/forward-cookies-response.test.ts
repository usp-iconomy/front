import { NextResponse } from 'next/server'
import { describe, expect, it } from 'vitest'
import { forwardSessionCookies } from './forward-cookies-response'

function request(cookie: string) {
  return new Request('http://localhost:3000/courses', { headers: { cookie, accept: 'text/html' } })
}

function authResponse(init: { setCookies: string[]; location?: string }) {
  const response = init.location ? NextResponse.redirect(init.location, 307) : NextResponse.next()
  for (const setCookie of init.setCookies) response.headers.append('set-cookie', setCookie)
  return new Response(response.body, response)
}

describe('forwardSessionCookies', () => {
  it('lets the page in this request read the session Auth.js just wrote, and still sends it to the browser', () => {
    const fromAuth = authResponse({ setCookies: ['authjs.session-token=refreshed; Path=/; HttpOnly'] })

    const result = forwardSessionCookies(request('theme=dark; authjs.session-token=stale'), fromAuth)

    expect(result.headers.get('x-middleware-next')).toBe('1')
    expect(result.headers.get('x-middleware-request-cookie')).toBe('theme=dark; authjs.session-token=refreshed')
    expect(result.headers.get('x-middleware-request-accept')).toBe('text/html')
    expect(result.headers.get('x-middleware-override-headers')?.split(',')).toEqual(
      expect.arrayContaining(['cookie', 'accept']),
    )
    expect(result.headers.getSetCookie()).toEqual(['authjs.session-token=refreshed; Path=/; HttpOnly'])
  })

  it('passes redirects through untouched', () => {
    const fromAuth = authResponse({
      location: 'http://localhost:3000/?reason=session-expired',
      setCookies: ['authjs.session-token=x; Path=/'],
    })

    expect(forwardSessionCookies(request('authjs.session-token=stale'), fromAuth)).toBe(fromAuth)
  })

  it('leaves the request alone when Auth.js wrote no session cookie', () => {
    const fromAuth = authResponse({ setCookies: ['authjs.csrf-token=abc; Path=/'] })

    expect(forwardSessionCookies(request('authjs.session-token=same'), fromAuth)).toBe(fromAuth)
  })
})
