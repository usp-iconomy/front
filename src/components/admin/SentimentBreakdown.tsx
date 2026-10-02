import { formatNumber } from '@/lib/format'
import type { MessageSentiment } from '@/types/domain'
import styles from './SentimentBreakdown.module.css'

const order: readonly MessageSentiment[] = ['positive', 'neutral', 'negative']

const label: Record<MessageSentiment, string> = {
  positive: 'Positivas',
  neutral: 'Neutras',
  negative: 'Negativas',
}

export type SentimentBreakdownProps = {
  shares: Record<MessageSentiment, number>
  counts: Record<MessageSentiment, number>
}

export function SentimentBreakdown({ shares, counts }: SentimentBreakdownProps) {
  return (
    <ul className={styles.list}>
      {order.map((key) => (
        <li key={key} className={styles.row}>
          <span className={styles.label}>{label[key]}</span>
          <span className={styles.track} aria-hidden="true">
            <span className={`${styles.bar} ${styles[key]}`} style={{ width: `${shares[key]}%` }} />
          </span>
          <span className={styles.value}>
            {shares[key]}% ({formatNumber(counts[key])} {counts[key] === 1 ? 'mensagem' : 'mensagens'})
          </span>
        </li>
      ))}
    </ul>
  )
}
