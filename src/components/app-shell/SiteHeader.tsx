import Link from 'next/link'
import { TokenAmount } from '@/design-system'
import { adminEntryFor } from '@/lib/admin-access'
import { roleLabel } from '@/lib/roles'
import { currentAdmin } from '@/mocks/admin'
import { currentUser } from '@/mocks/profile'
import { AccountMenu, type AccountDestination } from './AccountMenu'
import { PrimaryNav } from './PrimaryNav'
import styles from './SiteHeader.module.css'

const profileLink: AccountDestination = {
  href: '/profile',
  label: 'Meu perfil',
  description: 'Saldo, circulação e Tokens Alma',
  icon: 'wallet',
}

export function SiteHeader() {
  const adminEntry = currentUser.role === 'admin' ? adminEntryFor(currentAdmin.scope) : null

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/courses" className={styles.logo}>
          <span className={styles.logoMark} aria-hidden="true">
            U
          </span>
          <span className={styles.logoText}>USP Iconomy</span>
        </Link>
        <PrimaryNav />
      </div>
      <div className={styles.right}>
        <p className={styles.tokenPill}>
          <TokenAmount value={currentUser.tokenBalance} showUnit />
        </p>
        <AccountMenu
          name={currentUser.name}
          roleLabel={adminEntry?.scopeLabel ?? roleLabel[currentUser.role]}
          links={[profileLink]}
          switchTo={
            adminEntry
              ? {
                  href: adminEntry.href,
                  label: 'Administração',
                  description: adminEntry.description,
                  icon: 'shield',
                }
              : undefined
          }
        />
      </div>
    </header>
  )
}
