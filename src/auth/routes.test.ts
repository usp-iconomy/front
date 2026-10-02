import { describe, expect, it } from 'vitest'
import { isPublicPath, nextFromCallbackUrl, safeNextPath, safeRedirect } from './routes'

describe('isPublicPath', () => {
  it.each(['/', '/demo', '/demo/admin/users', '/api/auth/callback/keycloak'])('lets %s through without a session', (path) => {
    expect(isPublicPath(path)).toBe(true)
  })

  it.each(['/courses', '/admin', '/onboarding', '/demonstration', '/api/authx'])('requires a session for %s', (path) => {
    expect(isPublicPath(path)).toBe(false)
  })
})

describe('safeRedirect', () => {
  const baseUrl = 'http://localhost:3000'
  const issuer = 'http://localhost:8080/realms/iconomy'
  const endSession = `${issuer}/protocol/openid-connect/logout`

  it('resolves app paths against the base URL', () => {
    expect(safeRedirect('/courses', baseUrl, endSession)).toBe('http://localhost:3000/courses')
    expect(safeRedirect('//evil.example/x', baseUrl, endSession)).toBe('http://localhost:3000//evil.example/x')
  })

  it('keeps absolute URLs on the app origin', () => {
    expect(safeRedirect('http://localhost:3000/onboarding?x=1', baseUrl, endSession)).toBe('http://localhost:3000/onboarding?x=1')
  })

  it("allows Keycloak's end-session endpoint with its query", () => {
    const url = `${endSession}?client_id=iconomy-web&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F`
    expect(safeRedirect(url, baseUrl, endSession)).toBe(url)
  })

  it.each([
    'http://localhost:3000.evil.example/steal',
    'http://localhost:30001/',
    'https://evil.example/',
    `${issuer}/protocol/openid-connect/auth?client_id=iconomy-web&redirect_uri=https%3A%2F%2Fevil.example`,
    `${issuer}/account`,
    `${issuer}/protocol/openid-connect/logout/extra`,
    'http://localhost:8080/realms/iconomy-evil/protocol/openid-connect/logout',
    'http://localhost:8080/realms/master/protocol/openid-connect/logout',
    'http://localhost:8080/realms/iconomy/../master/protocol/openid-connect/logout',
    'https://localhost:8080/realms/iconomy/protocol/openid-connect/logout',
    'not a url',
  ])('falls back to the base URL for %s', (url) => {
    expect(safeRedirect(url, baseUrl, endSession)).toBe(baseUrl)
  })
})

describe('safeNextPath', () => {
  it('keeps same-app paths with their query and hash', () => {
    expect(safeNextPath('/courses')).toBe('/courses')
    expect(safeNextPath('/admin/users?page=2#top')).toBe('/admin/users?page=2#top')
  })

  it.each(['//evil.example', '/\\evil.example', '/\t/evil.example', 'https://evil.example', 'courses', ''])(
    'falls back for %j',
    (next) => {
      expect(safeNextPath(next)).toBe('/courses')
    },
  )

  it('falls back when the form field is missing or a file', () => {
    expect(safeNextPath(null)).toBe('/courses')
    expect(safeNextPath(new File([], 'x'))).toBe('/courses')
  })
})

describe('nextFromCallbackUrl', () => {
  const origin = 'http://localhost:3000'

  it('keeps path and query of an absolute URL on the app origin', () => {
    expect(nextFromCallbackUrl('http://localhost:3000/courses?page=2', origin)).toBe('/courses?page=2')
  })

  it('accepts an in-app path', () => {
    expect(nextFromCallbackUrl('/admin/users', origin)).toBe('/admin/users')
  })

  it.each([
    undefined,
    '',
    ['http://localhost:3000/admin'],
    'http://localhost:3000.evil.example/courses',
    'https://localhost:3000/courses',
    'https://evil.example/courses',
    '//evil.example/courses',
    'javascript:alert(1)',
    'not a url',
  ])('falls back to /courses for %j', (callbackUrl) => {
    expect(nextFromCallbackUrl(callbackUrl, origin)).toBe('/courses')
  })
})
