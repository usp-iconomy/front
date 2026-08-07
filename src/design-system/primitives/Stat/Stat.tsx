import type { ReactNode } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './Stat.module.css'

export type StatBoxProps = {
  icon: IconName
  label: string
  value: ReactNode
  caption?: string
}

export function StatBox({ icon, label, value, caption }: StatBoxProps) {
  return (
    <div className={styles.statBox}>
      <div className={styles.statIcon}>
        <Icon name={icon} size={22} />
      </div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {caption && <div className={styles.statCaption}>{caption}</div>}
    </div>
  )
}

export type MetricCardProps = {
  icon: IconName
  label: string
  value: string
  delta?: string
}

export function MetricCard({ icon, label, value, delta }: MetricCardProps) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>
        <Icon name={icon} size={24} />
      </div>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value}</div>
      {delta && (
        <div className={styles.metricDelta}>
          <Icon name="trendUp" size={12} />
          {delta}
        </div>
      )}
    </div>
  )
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className={styles.statGrid}>{children}</div>
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className={styles.metricGrid}>{children}</div>
}
