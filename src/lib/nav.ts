import type { IconName } from '@/design-system'
import { stripMode } from './mode'

export type NavItem = {
  /** An app path without the mode prefix; render it through `ModeLink`. */
  href: string
  label: string
  icon: IconName
}

export const navItems: readonly NavItem[] = [
  { href: '/courses', label: 'Cursos', icon: 'book' },
  { href: '/profile', label: 'Perfil', icon: 'wallet' },
  { href: '/circulation', label: 'Circulação', icon: 'arrows' },
  { href: '/scholarships', label: 'Bolsas', icon: 'ticket' },
  { href: '/achievements', label: 'Tokens Alma', icon: 'medal' },
  { href: '/impact', label: 'Impacto', icon: 'chart' },
]

/** True on the item's own page in either tree. */
export function isCurrentNavItem(item: NavItem, pathname: string): boolean {
  return stripMode(pathname) === item.href
}
