'use client'

import { usePathname } from 'next/navigation'
import { Icon } from '@/design-system'
import { isCurrentNavItem, navItems } from '@/lib/nav'
import { ModeLink } from './ModeLink'
import styles from './BottomNav.module.css'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} aria-label="Navegação principal (móvel)">
      {navItems.map((item) => {
        const isActive = isCurrentNavItem(item, pathname)
        return (
          <ModeLink
            key={item.href}
            href={item.href}
            className={`${styles.link} ${isActive ? styles.active : ''}`.trim()}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </ModeLink>
        )
      })}
    </nav>
  )
}
