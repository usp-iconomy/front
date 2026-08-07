import type { ReactNode } from 'react'
import type { Tone } from '../../tokens/tokens'
import styles from './Badge.module.css'

export type BadgeProps = {
  tone: Tone
  children: ReactNode
}

export function Badge({ tone, children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
