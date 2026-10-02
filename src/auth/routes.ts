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
 * Where Auth.js may send the browser: app paths, the app's own origin, or this realm's
 * endpoints (the end-session URL on sign-out). Anything else lands on the base URL.
 */
export function safeRedirect(url: string, baseUrl: string, issuer: string): string {
  if (url.startsWith('/')) return `${baseUrl}${url}`
  if (!URL.canParse(url)) return baseUrl
  // Origin, not string prefix: "http://localhost:3000.evil.example" starts with the base URL.
  const target = new URL(url)
  if (target.origin === new URL(baseUrl).origin) return url
  if (target.href.startsWith(`${issuer}/`)) return url
  return baseUrl
}
