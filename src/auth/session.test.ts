// @vitest-environment node
import { encode } from 'next-auth/jwt'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getAccessToken, getIdToken } from './session'

const request = vi.hoisted(() => ({ headers: new Headers() }))
vi.mock('next/headers', () => ({ headers: async () => request.headers }))

const secret = 'test-secret-that-is-long-enough-for-jwe'
const tokens = { name: 'Ana', accessToken: 'access-1', refreshToken: 'refresh-1', idToken: 'id-1', expiresAt: 9_999_999_999 }

async function sessionCookie(name: string, token: Record<string, unknown> = tokens): Promise<string> {
  return `${name}=${await encode({ token, secret, salt: name })}`
}

function setRequest(cookie: string, forwardedProto?: string) {
  request.headers = new Headers({ cookie, ...(forwardedProto ? { 'x-forwarded-proto': forwardedProto } : {}) })
}

beforeEach(() => {
  vi.stubEnv('AUTH_SECRET', secret)
  vi.stubEnv('AUTH_URL', undefined)
  vi.stubEnv('NODE_ENV', 'production')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getAccessToken', () => {
  it('reads the plain cookie when AUTH_URL is http, even in production', async () => {
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    setRequest(await sessionCookie('authjs.session-token'))

    expect(await getAccessToken()).toBe('access-1')
  })

  it('reads the __Secure- cookie when AUTH_URL is https', async () => {
    vi.stubEnv('AUTH_URL', 'https://iconomy.example')
    setRequest(await sessionCookie('__Secure-authjs.session-token'))

    expect(await getAccessToken()).toBe('access-1')
  })

  it('ignores the plain cookie when AUTH_URL is https', async () => {
    vi.stubEnv('AUTH_URL', 'https://iconomy.example')
    setRequest(await sessionCookie('authjs.session-token'))

    expect(await getAccessToken()).toBeNull()
  })

  it('follows x-forwarded-proto when AUTH_URL is unset', async () => {
    setRequest(await sessionCookie('__Secure-authjs.session-token'), 'https')
    expect(await getAccessToken()).toBe('access-1')

    setRequest(await sessionCookie('authjs.session-token'), 'http')
    expect(await getAccessToken()).toBe('access-1')
  })

  it('lets AUTH_URL win over x-forwarded-proto, as Auth.js does when writing the cookie', async () => {
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    setRequest(await sessionCookie('authjs.session-token'), 'https')

    expect(await getAccessToken()).toBe('access-1')
  })

  it('returns null without a session cookie', async () => {
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    setRequest('')

    expect(await getAccessToken()).toBeNull()
  })

  it('returns null once the refresh has failed, while the id token stays readable for sign-out', async () => {
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    setRequest(await sessionCookie('authjs.session-token', { ...tokens, error: 'RefreshFailed' }))

    expect(await getAccessToken()).toBeNull()
    expect(await getIdToken()).toBe('id-1')
  })
})
