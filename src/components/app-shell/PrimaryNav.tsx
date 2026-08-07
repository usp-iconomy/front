'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/design-system'
import { navItems } from '@/lib/nav'
import styles from './PrimaryNav.module.css'

export function PrimaryNav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <ul className={styles.list}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${isActive ? styles.active : ''}`.trim()}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
