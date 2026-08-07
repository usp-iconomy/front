'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/design-system'
import { navItems } from '@/lib/nav'
import styles from './BottomNav.module.css'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} aria-label="Navegação principal (móvel)">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${isActive ? styles.active : ''}`.trim()}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
