const SESSION_COOKIE = /^(__Secure-)?authjs\.session-token(\.\d+)?$/

type CookieUpdate = { name: string; value: string; removed: boolean }

function parseSetCookie(setCookie: string, nowMs: number): CookieUpdate | null {
  const [pair = '', ...attributes] = setCookie.split(';')
  const separator = pair.indexOf('=')
  if (separator <= 0) return null
  const name = pair.slice(0, separator).trim()
  const value = pair.slice(separator + 1).trim()

  let removed = false
  for (const attribute of attributes) {
    const [key = '', ...rest] = attribute.split('=')
    const attributeValue = rest.join('=').trim()
    const normalized = key.trim().toLowerCase()
    // RFC 6265 5.2.2: a Max-Age that is not an optional '-' plus digits is ignored.
    if (normalized === 'max-age' && /^-?\d+$/.test(attributeValue) && Number(attributeValue) <= 0) removed = true
    if (normalized === 'expires' && Date.parse(attributeValue) <= nowMs) removed = true
  }
  return { name, value, removed }
}

/**
 * The request `cookie` header as it would read after the browser applied the session `Set-Cookie`s.
 * Other cookies pass through untouched; only Auth.js session cookies (chunked or not) are applied.
 */
export function mergeSetCookiesIntoCookieHeader(
  cookieHeader: string | null,
  setCookies: readonly string[],
  nowMs: number = Date.now(),
): string {
  const cookies = new Map<string, string>()
  for (const part of (cookieHeader ?? '').split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const separator = trimmed.indexOf('=')
    const name = separator === -1 ? trimmed : trimmed.slice(0, separator)
    cookies.set(name, separator === -1 ? '' : trimmed.slice(separator + 1))
  }

  for (const setCookie of setCookies) {
    const update = parseSetCookie(setCookie, nowMs)
    if (!update || !SESSION_COOKIE.test(update.name)) continue
    if (update.removed) cookies.delete(update.name)
    else cookies.set(update.name, update.value)
  }

  return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ')
}

export function isSessionCookie(setCookie: string): boolean {
  return SESSION_COOKIE.test(setCookie.slice(0, setCookie.indexOf('=')).trim())
}
