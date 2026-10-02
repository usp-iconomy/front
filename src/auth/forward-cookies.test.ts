import { describe, expect, it } from 'vitest'
import { mergeSetCookiesIntoCookieHeader } from './forward-cookies'

const NOW = Date.parse('2026-10-02T12:00:00Z')
const merge = (cookieHeader: string | null, setCookies: string[]) =>
  mergeSetCookiesIntoCookieHeader(cookieHeader, setCookies, NOW)

describe('mergeSetCookiesIntoCookieHeader', () => {
  it('replaces the session cookie value in place and keeps the other cookies', () => {
    expect(
      merge('theme=dark; authjs.session-token=old; authjs.csrf-token=abc', [
        'authjs.session-token=new; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000',
      ]),
    ).toBe('theme=dark; authjs.session-token=new; authjs.csrf-token=abc')
  })

  it('adds a session cookie the request did not carry', () => {
    expect(merge('theme=dark', ['authjs.session-token=new; Path=/'])).toBe('theme=dark; authjs.session-token=new')
    expect(merge(null, ['authjs.session-token=new; Path=/'])).toBe('authjs.session-token=new')
  })

  it('replaces every chunk of a chunked session', () => {
    expect(
      merge('authjs.session-token.0=old0; authjs.session-token.1=old1', [
        'authjs.session-token.0=new0; Path=/',
        'authjs.session-token.1=new1; Path=/',
      ]),
    ).toBe('authjs.session-token.0=new0; authjs.session-token.1=new1')
  })

  it('drops chunks that Auth.js clears with Max-Age=0 or a past Expires', () => {
    expect(
      merge('authjs.session-token.0=old0; authjs.session-token.1=old1; authjs.session-token.2=old2', [
        'authjs.session-token.0=new0; Path=/',
        'authjs.session-token.1=; Path=/; Max-Age=0',
        'authjs.session-token.2=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      ]),
    ).toBe('authjs.session-token.0=new0')
  })

  it('ignores an empty or malformed Max-Age, as RFC 6265 does', () => {
    expect(
      merge('authjs.session-token.0=old0; authjs.session-token.1=old1', [
        'authjs.session-token.0=new0; Path=/; Max-Age=',
        'authjs.session-token.1=new1; Path=/; Max-Age=soon',
      ]),
    ).toBe('authjs.session-token.0=new0; authjs.session-token.1=new1')
  })

  it('switches from one cookie to chunks when the session grows', () => {
    expect(
      merge('authjs.session-token=small', [
        'authjs.session-token=; Path=/; Max-Age=0',
        'authjs.session-token.0=big0; Path=/',
        'authjs.session-token.1=big1; Path=/',
      ]),
    ).toBe('authjs.session-token.0=big0; authjs.session-token.1=big1')
  })

  it('handles the __Secure- prefix used over https', () => {
    expect(merge('__Secure-authjs.session-token=old', ['__Secure-authjs.session-token=new; Path=/; Secure'])).toBe(
      '__Secure-authjs.session-token=new',
    )
  })

  it('ignores Set-Cookie for anything but the session', () => {
    expect(
      merge('authjs.session-token=same', [
        'authjs.csrf-token=changed; Path=/',
        'authjs.callback-url=http%3A%2F%2Flocalhost; Path=/',
        'other.session-token=x; Path=/',
      ]),
    ).toBe('authjs.session-token=same')
  })

  it('keeps values that contain "="', () => {
    expect(merge('a=b=c', ['authjs.session-token=x==; Path=/'])).toBe('a=b=c; authjs.session-token=x==')
  })
})
