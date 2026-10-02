import { Avatar, Icon, TokenAmount } from '@/design-system'
import { formatElapsed } from '@/lib/format'
import type { CirculationEntry } from '@/types/domain'
import styles from './FeedItem.module.css'

export function FeedItem({ entry }: { entry: CirculationEntry }) {
  return (
    <article className={styles.item}>
      <Avatar name={entry.senderName} size="lg" initialsCount={1} />
      <div className={styles.body}>
        <div className={styles.top}>
          <p className={styles.names}>
            <strong>{entry.senderName}</strong>
            <Icon name="arrowRight" size={14} color="var(--color-text-light)" />
            <strong>{entry.recipientName}</strong>
          </p>
          {/* Server and client evaluate `now` milliseconds apart. */}
          <time className={styles.time} dateTime={entry.occurredAt} suppressHydrationWarning>
            {formatElapsed(entry.occurredAt)}
          </time>
        </div>

        <p className={styles.action}>
          Circulou <TokenAmount value={entry.amount} showUnit />
          {entry.courseTitle && <span className={styles.course}> no curso {entry.courseTitle}</span>}
        </p>

        <blockquote className={styles.message}>{entry.message}</blockquote>
      </div>
    </article>
  )
}
