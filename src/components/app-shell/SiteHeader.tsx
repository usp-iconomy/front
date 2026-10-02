import Link from 'next/link'
import { TokenAmount } from '@/design-system'
import { signOutAction } from '@/auth/actions'
import type { AdminEntry } from '@/lib/admin-access'
import { pathFor, type Mode } from '@/lib/mode'
import { roleLabel } from '@/lib/roles'
import type { Member, WalletSummary } from '@/types/domain'
import { AccountMenu } from './AccountMenu'
import { PrimaryNav } from './PrimaryNav'
import styles from './SiteHeader.module.css'

export type SiteHeaderProps = {
  mode: Mode
  member: Member
  /** Null while the wallet has no data source; the balance pill is hidden. */
  wallet: WalletSummary | null
  adminEntry: AdminEntry | null
}

export function SiteHeader({ mode, member, wallet, adminEntry }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href={pathFor(mode, '/courses')} className={styles.logo}>
          <span className={styles.logoMark} aria-hidden="true">
            U
          </span>
          <span className={styles.logoText}>USP Iconomy</span>
        </Link>
        <PrimaryNav />
      </div>
      <div className={styles.right}>
        {wallet && (
          <p className={styles.tokenPill}>
            <TokenAmount value={wallet.tokenBalance} showUnit />
          </p>
        )}
        <AccountMenu
          name={member.name}
          roleLabel={adminEntry?.scopeLabel ?? (member.role ? roleLabel[member.role] : 'Perfil a definir')}
          links={[
            {
              href: pathFor(mode, '/profile'),
              label: 'Meu perfil',
              description: 'Saldo, circulação e Tokens Alma',
              icon: 'wallet',
            },
          ]}
          switchTo={
            adminEntry
              ? {
                  href: pathFor(mode, adminEntry.href),
                  label: 'Administração',
                  description: adminEntry.description,
                  icon: 'shield',
                }
              : undefined
          }
          signOut={mode === 'real' ? signOutAction : undefined}
          exitDemoHref={mode === 'demo' ? '/' : undefined}
        />
      </div>
    </header>
  )
}
