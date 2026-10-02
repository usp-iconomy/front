'use client'

import { usePathname } from 'next/navigation'
import { Icon } from '@/design-system'
import { isCurrentNavItem, navItems } from '@/lib/nav'
import { ModeLink } from './ModeLink'
import styles from './PrimaryNav.module.css'

export function PrimaryNav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <ul className={styles.list}>
        {navItems.map((item) => {
          const isActive = isCurrentNavItem(item, pathname)
          return (
            <li key={item.href}>
              <ModeLink
                href={item.href}
                className={`${styles.link} ${isActive ? styles.active : ''}`.trim()}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </ModeLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
