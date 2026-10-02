import type { IconName } from '@/design-system'
import type { AdminScope } from '@/types/domain'

export type AdminSection =
  | 'overview'
  | 'courses'
  | 'distribution-codes'
  | 'token-settings'
  | 'users'
  | 'communities'

export type AdminNavItem = {
  section: AdminSection
  href: string
  label: string
  icon: IconName
}

const navItems: readonly AdminNavItem[] = [
  { section: 'overview', href: '/admin', label: 'Visão geral', icon: 'chart' },
  { section: 'courses', href: '/admin/courses', label: 'Aprovação de cursos', icon: 'book' },
  { section: 'distribution-codes', href: '/admin/distribution-codes', label: 'Códigos de distribuição', icon: 'ticket' },
  { section: 'token-settings', href: '/admin/token-settings', label: 'Taxas do token', icon: 'arrows' },
  { section: 'users', href: '/admin/users', label: 'Usuários e papéis', icon: 'users' },
  { section: 'communities', href: '/admin/communities', label: 'Comunidades', icon: 'globe' },
]

/** RF-09 keeps codes with USP admins; RF-13 gives the community admin its own data and decay rate. */
const quilombolaSections: ReadonlySet<AdminSection> = new Set(['token-settings', 'communities'])

export function adminNavFor(scope: AdminScope): readonly AdminNavItem[] {
  if (scope.kind === 'usp') return navItems
  return navItems
    .filter((item) => quilombolaSections.has(item.section))
    .map((item) =>
      item.section === 'communities'
        ? { ...item, href: `/admin/communities/${scope.communityId}`, label: 'Minha comunidade' }
        : item,
    )
}

export function sectionForPath(pathname: string): AdminSection | null {
  if (pathname === '/admin') return 'overview'
  const segment = pathname.split('/')[2]
  const match = navItems.find((item) => item.section !== 'overview' && item.section === segment)
  return match?.section ?? null
}

/** Hides screens only. The Explorer API has to enforce the same rule. */
export function canAccessAdminPath(scope: AdminScope, pathname: string): boolean {
  const section = sectionForPath(pathname)
  if (section === null) return false
  if (scope.kind === 'usp') return true
  if (!quilombolaSections.has(section)) return false
  if (section === 'communities') return pathname === `/admin/communities/${scope.communityId}`
  return true
}
