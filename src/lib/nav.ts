import type { IconName } from '@/design-system'

export type NavItem = {
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
