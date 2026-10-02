import { describe, expect, it } from 'vitest'
import { isPublicPath, safeRedirect } from './routes'

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

  it('resolves app paths against the base URL', () => {
    expect(safeRedirect('/courses', baseUrl, issuer)).toBe('http://localhost:3000/courses')
    expect(safeRedirect('//evil.example/x', baseUrl, issuer)).toBe('http://localhost:3000//evil.example/x')
  })

  it('keeps absolute URLs on the app origin', () => {
    expect(safeRedirect('http://localhost:3000/onboarding?x=1', baseUrl, issuer)).toBe('http://localhost:3000/onboarding?x=1')
  })

  it("allows Keycloak's end-session endpoint in the app's realm", () => {
    const endSession = `${issuer}/protocol/openid-connect/logout?client_id=iconomy-web`
    expect(safeRedirect(endSession, baseUrl, issuer)).toBe(endSession)
  })

  it.each([
    'http://localhost:3000.evil.example/steal',
    'http://localhost:30001/',
    'https://evil.example/',
    'http://localhost:8080/realms/iconomy-evil/protocol/openid-connect/logout',
    'http://localhost:8080/realms/master/protocol/openid-connect/logout',
    'http://localhost:8080/realms/iconomy/../master/protocol/openid-connect/logout',
    'not a url',
  ])('falls back to the base URL for %s', (url) => {
    expect(safeRedirect(url, baseUrl, issuer)).toBe(baseUrl)
  })
})
