import type { ReactNode } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './StatusText.module.css'

export type StatusTextProps = {
  tone?: 'positive' | 'neutral' | 'negative'
  icon?: IconName
  children: ReactNode
}

export function StatusText({ tone = 'positive', icon = 'check', children }: StatusTextProps) {
  return (
    <span className={`${styles.status} ${styles[tone]}`}>
      <Icon name={icon} size={13} />
      {children}
    </span>
  )
}
