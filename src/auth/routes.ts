import { DEMO_PREFIX } from '@/lib/mode'

/** Paths reachable without a session. Everything else is the real tree. */
export function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === DEMO_PREFIX ||
    pathname.startsWith(`${DEMO_PREFIX}/`) ||
    pathname.startsWith('/api/auth/')
  )
}

/**
 * Where Auth.js may send the browser: app paths, the app's own origin, or Keycloak's
 * end-session endpoint (the sign-out destination). Anything else lands on the base URL.
 */
export function safeRedirect(url: string, baseUrl: string, endSessionEndpoint: string): string {
  if (url.startsWith('/')) return `${baseUrl}${url}`
  if (!URL.canParse(url)) return baseUrl
  // Origin, not string prefix: "http://localhost:3000.evil.example" starts with the base URL.
  const target = new URL(url)
  if (target.origin === new URL(baseUrl).origin) return url
  const endSession = new URL(endSessionEndpoint)
  if (target.origin === endSession.origin && target.pathname === endSession.pathname) return url
  return baseUrl
}

const PROBE_ORIGIN = 'http://app.invalid'

/** The in-app path to land on after sign-in. Anything that could leave the app becomes the fallback. */
export function safeNextPath(next: unknown, fallback = '/courses'): string {
  if (typeof next !== 'string' || !/^\/(?![/\\])/.test(next)) return fallback
  // The URL parser drops tabs and newlines, so "/\t/evil.example" resolves to another host.
  const url = new URL(next, PROBE_ORIGIN)
  if (url.origin !== PROBE_ORIGIN) return fallback
  // Dot segments can collapse to "//host", which a browser reads as another origin.
  if (url.pathname.startsWith('//')) return fallback
  return `${url.pathname}${url.search}${url.hash}`
}

/** The `next` path for the entry page. Auth.js sends `callbackUrl` as an absolute URL; only the app's own origin is honoured. */
export function nextFromCallbackUrl(callbackUrl: unknown, appOrigin: string, fallback = '/courses'): string {
  if (typeof callbackUrl !== 'string') return fallback
  if (callbackUrl.startsWith('/')) return safeNextPath(callbackUrl, fallback)
  if (!URL.canParse(callbackUrl) || !URL.canParse(appOrigin)) return fallback
  const url = new URL(callbackUrl)
  if (url.origin !== new URL(appOrigin).origin) return fallback
  return safeNextPath(`${url.pathname}${url.search}${url.hash}`, fallback)
}
