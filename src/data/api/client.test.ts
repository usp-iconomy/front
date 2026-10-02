import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, createApiClient } from './client'

const BASE = 'http://localhost:8000'

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function clientWith(fetchImpl: typeof fetch, extra: { timeoutMs?: number } = {}) {
  return createApiClient({ baseUrl: BASE, fetchImpl, ...extra })
}

function callAt(fetchImpl: ReturnType<typeof vi.fn<typeof fetch>>, index: number) {
  const call = fetchImpl.mock.calls[index]
  if (!call) throw new Error(`fetch call ${index} was not made`)
  return { url: call[0], init: call[1] ?? {} }
}

async function catchError(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise
  } catch (error) {
    return error as ApiError
  }
  throw new Error('expected the request to reject')
}

function failingBody(error: unknown, status = 200): Response {
  const body = new ReadableStream({
    start(controller) {
      controller.error(error)
    },
  })
  return new Response(body, { status, headers: { 'content-type': 'application/json' } })
}

describe('createApiClient', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends the bearer token and Accept header, with no body headers on a GET', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => json({}))
    await clientWith(fetchImpl).request('/auth/me', { accessToken: 'tok' })

    const { init } = callAt(fetchImpl, 0)
    const headers = new Headers(init.headers)
    expect(headers.get('Authorization')).toBe('Bearer tok')
    expect(headers.get('Accept')).toBe('application/json')
    expect(headers.has('Content-Type')).toBe(false)
    expect(init.method).toBe('GET')
    expect(init.body).toBeUndefined()
  })

  it('sends a JSON body with its Content-Type', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => json({}))
    await clientWith(fetchImpl).request('/things', {
      method: 'POST',
      body: { name: 'a', nested: { n: 1 } },
      accessToken: 'tok',
    })

    const { init } = callAt(fetchImpl, 0)
    expect(init.method).toBe('POST')
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json')
    expect(init.body).toBe(JSON.stringify({ name: 'a', nested: { n: 1 } }))
  })

  it('joins baseUrl and path without a double slash', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => json({}))
    const client = createApiClient({ baseUrl: `${BASE}/`, fetchImpl })
    await client.request('/auth/me', { accessToken: 'tok' })
    await client.request('auth/me', { accessToken: 'tok' })

    expect(callAt(fetchImpl, 0).url).toBe('http://localhost:8000/auth/me')
    expect(callAt(fetchImpl, 1).url).toBe('http://localhost:8000/auth/me')
  })

  it('returns the parsed JSON on 2xx', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(json({ id: 'u1', fullName: 'Ana' }))
    const result = await clientWith(fetchImpl).request<{ id: string; fullName: string }>('/auth/me', {
      accessToken: 'tok',
    })
    expect(result).toEqual({ id: 'u1', fullName: 'Ana' })
  })

  it('returns undefined on 204', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }))
    const result = await clientWith(fetchImpl).request('/things/1', { method: 'POST', accessToken: 'tok' })
    expect(result).toBeUndefined()
  })

  it('maps a problem+json error body to ApiError', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      json(
        {
          type: 'about:blank',
          title: 'Forbidden',
          status: 403,
          detail: 'Not allowed here',
          code: 'forbidden',
        },
        403,
      ),
    )
    const error = await catchError(clientWith(fetchImpl).request('/admin', { accessToken: 'tok' }))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(403)
    expect(error.code).toBe('forbidden')
    expect(error.title).toBe('Forbidden')
    expect(error.detail).toBe('Not allowed here')
  })

  it('maps a non-JSON error body to an http_<status> ApiError', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 }))
    const error = await catchError(clientWith(fetchImpl).request('/auth/me', { accessToken: 'tok' }))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(502)
    expect(error.code).toBe('http_502')
    expect(error.title).toBe('HTTP 502')
    expect(error.detail).toBe('')
  })

  it('maps a rejected fetch to a network_error ApiError with status 0', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('fetch failed'))
    const error = await catchError(clientWith(fetchImpl).request('/auth/me', { accessToken: 'tok' }))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.code).toBe('network_error')
  })

  it('passes a timeout signal, defaulting to 10000 ms', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout')
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => json({}))

    await clientWith(fetchImpl).request('/auth/me', { accessToken: 'tok' })
    expect(timeout).toHaveBeenLastCalledWith(10000)
    expect(callAt(fetchImpl, 0).init.signal).toBeDefined()

    await clientWith(fetchImpl, { timeoutMs: 250 }).request('/auth/me', { accessToken: 'tok' })
    expect(timeout).toHaveBeenLastCalledWith(250)
  })

  it.each(['AbortError', 'TimeoutError'])('maps a %s to a timeout ApiError with status 0', async (name) => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new DOMException('aborted', name))
    const error = await catchError(clientWith(fetchImpl).request('/auth/me', { accessToken: 'tok' }))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.code).toBe('timeout')
  })

  it('keeps a missing problem+json field on its http_<status> fallback', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => json({ title: 'X' }, 409))
    const error = await catchError(clientWith(fetchImpl).request('/things', { accessToken: 'tok' }))

    expect(error.status).toBe(409)
    expect(error.code).toBe('http_409')
    expect(error.title).toBe('X')
    expect(error.detail).toBe('')
  })

  it('maps a timeout during the 2xx body read to a timeout ApiError', async () => {
    const reason = new DOMException('aborted', 'TimeoutError')
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => failingBody(reason))
    const error = await catchError(clientWith(fetchImpl).request('/auth/me', { accessToken: 'tok' }))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.code).toBe('timeout')
  })

  it('maps any other 2xx body read failure to a network_error ApiError', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => failingBody(new TypeError('terminated')))
    const error = await catchError(clientWith(fetchImpl).request('/auth/me', { accessToken: 'tok' }))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.code).toBe('network_error')
  })

  it.each([
    ['empty', '', 200],
    ['not JSON', '<html>ok</html>', 201],
  ])('maps a 2xx body that is %s to an invalid_response ApiError', async (_label, text, status) => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => new Response(text, { status }))
    const error = await catchError(clientWith(fetchImpl).request('/things', { accessToken: 'tok' }))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(status)
    expect(error.code).toBe('invalid_response')
    expect(error.title).toBe('Invalid response')
    expect(error.detail).toBe('')
  })

  it('keeps the underlying error as cause on network_error and timeout', async () => {
    const down = new TypeError('fetch failed')
    let fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(down)
    expect((await catchError(clientWith(fetchImpl).request('/a', { accessToken: 't' }))).cause).toBe(down)

    const aborted = new DOMException('aborted', 'TimeoutError')
    fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(aborted)
    expect((await catchError(clientWith(fetchImpl).request('/a', { accessToken: 't' }))).cause).toBe(aborted)
  })
})
