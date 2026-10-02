'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Icon } from '@/design-system'
import { adminEntryFor, adminNavFor, canAccessAdminPath, sectionForPath } from '@/lib/admin-access'
import { signOutAction } from '@/auth/actions'
import { modeFromPath, pathFor, stripMode } from '@/lib/mode'
import type { AdminUser } from '@/types/domain'
import { AccountMenu } from '../app-shell/AccountMenu'
import { AccessDenied } from './AccessDenied'
import styles from './AdminShell.module.css'

type AdminShellProps = {
  admin: AdminUser
  children: ReactNode
}

export function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname()
  const mode = modeFromPath(pathname)
  const appPath = stripMode(pathname)
  const items = adminNavFor(admin.scope)
  // Unknown paths fall through to Next's 404 instead of reading as a permission problem.
  const denied = sectionForPath(appPath) !== null && !canAccessAdminPath(admin.scope, appPath)
  const { scopeLabel } = adminEntryFor(admin.scope)

  return (
    <div className={styles.shell}>
      <a href="#conteudo" className={styles.skipLink}>
        Pular para o conteúdo
      </a>
      <aside className={styles.sidebar}>
        <Link href={pathFor(mode, items[0]?.href ?? '/admin')} className={styles.logo}>
          USP Iconomy <span className={styles.logoTag}>Admin</span>
        </Link>
        <nav aria-label="Navegação administrativa" className={styles.nav}>
          <ul className={styles.navList}>
            {items.map((item) => {
              const isActive =
                item.href === '/admin' ? appPath === '/admin' : appPath === item.href || appPath.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={pathFor(mode, item.href)}
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
          <AccountMenu
            name={admin.name}
            roleLabel={scopeLabel}
            showIdentity
            side="top"
            align="start"
            signOut={mode === 'real' ? signOutAction : undefined}
            exitDemoHref={mode === 'demo' ? '/' : undefined}
            switchTo={{
              href: pathFor(mode, '/courses'),
              label: 'Plataforma',
              description: 'Cursos, carteira e circulação',
              icon: 'school',
            }}
          />
        </div>
      </aside>
      <main id="conteudo" className={styles.main}>
        <div className={styles.container}>{denied ? <AccessDenied /> : children}</div>
      </main>
    </div>
  )
}
