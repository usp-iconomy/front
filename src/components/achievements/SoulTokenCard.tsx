import type { ReactNode } from 'react'
import { Icon } from '@/design-system'
import { formatMonth } from '@/lib/format'
import type { SoulToken } from '@/types/domain'
import styles from './SoulTokenCard.module.css'

export function SoulTokenGrid({ children }: { children: ReactNode }) {
  return <ul className={styles.grid}>{children}</ul>
}

export function SoulTokenCard({ token }: { token: SoulToken }) {
  return (
    <li className={styles.card}>
      <span className={styles.icon}>
        <Icon name="medal" size={48} color="white" strokeWidth={1.2} />
      </span>
      <h3 className={styles.name}>{token.courseTitle}</h3>
      <p className={styles.date}>
        Concluído em <time dateTime={token.issuedAt}>{formatMonth(token.issuedAt)}</time>
      </p>
      {token.place && <p className={styles.place}>{token.place}</p>}
      <p className={styles.tag}>
        <Icon name="lock" size={11} color="white" />
        Não-transferível
      </p>
    </li>
  )
}
