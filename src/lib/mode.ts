export type Mode = 'demo' | 'real'

export const DEMO_PREFIX = '/demo'

export function modeFromPath(pathname: string): Mode {
  return pathname === DEMO_PREFIX || pathname.startsWith(`${DEMO_PREFIX}/`) ? 'demo' : 'real'
}

export function stripMode(pathname: string): string {
  if (modeFromPath(pathname) === 'real') return pathname
  const rest = pathname.slice(DEMO_PREFIX.length)
  return rest === '' ? '/' : rest
}

/** The same app path inside the given tree. Accepts paths with or without the demo prefix. */
export function pathFor(mode: Mode, path: string): string {
  if (!path.startsWith('/')) throw new Error(`pathFor expects an absolute app path, got "${path}"`)
  const appPath = stripMode(path)
  if (mode === 'real') return appPath
  return appPath === '/' ? DEMO_PREFIX : `${DEMO_PREFIX}${appPath}`
}
