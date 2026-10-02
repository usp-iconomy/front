'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Avatar, Icon } from '@/design-system'
import { adminNavFor, canAccessAdminPath, sectionForPath } from '@/lib/admin-access'
import type { AdminUser } from '@/types/domain'
import { AccessDenied } from './AccessDenied'
import styles from './AdminShell.module.css'

type AdminShellProps = {
  admin: AdminUser
  children: ReactNode
}

export function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname()
  const items = adminNavFor(admin.scope)
  // Unknown paths fall through to Next's 404 instead of reading as a permission problem.
  const denied = sectionForPath(pathname) !== null && !canAccessAdminPath(admin.scope, pathname)
  const scopeLabel = admin.scope.kind === 'usp' ? 'Administração USP' : 'Administração quilombola'

  return (
    <div className={styles.shell}>
      <a href="#conteudo" className={styles.skipLink}>
        Pular para o conteúdo
      </a>
      <aside className={styles.sidebar}>
        <Link href={items[0]?.href ?? '/admin'} className={styles.logo}>
          USP Iconomy <span className={styles.logoTag}>Admin</span>
        </Link>
        <nav aria-label="Navegação administrativa" className={styles.nav}>
          <ul className={styles.navList}>
            {items.map((item) => {
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.link} ${isActive ? styles.active : ''}`.trim()}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className={styles.identity}>
          <Avatar name={admin.name} size="sm" />
          <div className={styles.identityText}>
            <p className={styles.adminName}>{admin.name}</p>
            <p className={styles.adminScope}>{scopeLabel}</p>
          </div>
        </div>
        <Link href="/courses" className={styles.exitLink}>
          Voltar ao site
        </Link>
      </aside>
      <main id="conteudo" className={styles.main}>
        <div className={styles.container}>{denied ? <AccessDenied /> : children}</div>
      </main>
    </div>
  )
}
