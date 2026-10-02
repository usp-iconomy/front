import 'server-only'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly title: string
  readonly detail: string

  constructor(fields: { status: number; code: string; title: string; detail: string; cause?: unknown }) {
    super(fields.detail || fields.title, fields.cause === undefined ? undefined : { cause: fields.cause })
    this.name = 'ApiError'
    this.status = fields.status
    this.code = fields.code
    this.title = fields.title
    this.detail = fields.detail
  }
}

export type ApiRequest = { method?: 'GET' | 'POST'; body?: unknown; accessToken: string }

const DEFAULT_TIMEOUT_MS = 10_000

function isTimeout(error: unknown): boolean {
  const name = (error as { name?: unknown } | null)?.name
  return name === 'AbortError' || name === 'TimeoutError'
}

async function toApiError(response: Response): Promise<ApiError> {
  const fallback = {
    status: response.status,
    code: `http_${response.status}`,
    title: `HTTP ${response.status}`,
    detail: '',
  }
  try {
    const problem = await response.json()
    return new ApiError({
      status: response.status,
      code: typeof problem?.code === 'string' ? problem.code : fallback.code,
      title: typeof problem?.title === 'string' ? problem.title : fallback.title,
      detail: typeof problem?.detail === 'string' ? problem.detail : fallback.detail,
    })
  } catch {
    return new ApiError(fallback)
  }
}

function transportError(error: unknown): ApiError {
  const timedOut = isTimeout(error)
  return new ApiError({
    status: 0,
    code: timedOut ? 'timeout' : 'network_error',
    title: timedOut ? 'Request timed out' : 'Network error',
    detail: (error as { message?: unknown } | null)?.message?.toString() ?? '',
    cause: error,
  })
}

/** `fetchImpl` is injectable for tests; defaults to global fetch. */
export function createApiClient(options: { baseUrl: string; fetchImpl?: typeof fetch; timeoutMs?: number }) {
  const { baseUrl, fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = options
  const root = baseUrl.replace(/\/+$/, '')

  return {
    async request<T>(path: string, init: ApiRequest): Promise<T> {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${init.accessToken}`,
        Accept: 'application/json',
      }
      if (init.body !== undefined) headers['Content-Type'] = 'application/json'

      let response: Response
      try {
        response = await fetchImpl(`${root}/${path.replace(/^\/+/, '')}`, {
          method: init.method ?? 'GET',
          headers,
          body: init.body === undefined ? undefined : JSON.stringify(init.body),
          signal: AbortSignal.timeout(timeoutMs),
        })
      } catch (error) {
        throw transportError(error)
      }

      if (!response.ok) throw await toApiError(response)
      if (response.status === 204) return undefined as T

      let text: string
      try {
        text = await response.text()
      } catch (error) {
        throw transportError(error)
      }
      try {
        return JSON.parse(text) as T
      } catch {
        throw new ApiError({
          status: response.status,
          code: 'invalid_response',
          title: 'Invalid response',
          detail: '',
        })
      }
    },
  }
}
