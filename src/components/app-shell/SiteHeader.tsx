import Link from 'next/link'
import { Avatar, TokenAmount } from '@/design-system'
import { currentUser } from '@/mocks/profile'
import { PrimaryNav } from './PrimaryNav'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
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
        <Avatar name={currentUser.name} />
      </div>
    </header>
  )
}
