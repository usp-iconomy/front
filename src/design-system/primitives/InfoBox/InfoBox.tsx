import type { ReactNode } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './InfoBox.module.css'

export type InfoBoxProps = {
  title?: string
  icon?: IconName
  children?: ReactNode
  /** Rendered as a checklist below the body copy. */
  items?: readonly string[]
}

export function InfoBox({ title, icon, children, items }: InfoBoxProps) {
  return (
    <aside className={styles.infoBox}>
      {title && (
        <h3 className={styles.title}>
          {icon && <Icon name={icon} size={16} color="var(--color-accent-strong)" />}
          {title}
        </h3>
      )}
      {children && <p className={styles.body}>{children}</p>}
      {items && (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item}>
              <Icon name="check" size={14} color="var(--color-positive)" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
