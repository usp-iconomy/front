import type { ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
import styles from './FlowStep.module.css'

export type FlowStepStatus = 'current' | 'done' | 'pending'

export type FlowStepProps = {
  step: number
  title: string
  description: string
  status?: FlowStepStatus
  children?: ReactNode
}

const statusLabel: Record<FlowStepStatus, string> = {
  current: 'Etapa atual',
  done: 'Etapa concluída',
  pending: 'Etapa pendente',
}

export function FlowStep({ step, title, description, status = 'current', children }: FlowStepProps) {
  return (
    <div className={`${styles.step} ${styles[status] ?? ''}`.trim()}>
      <div className={styles.marker} role="img" aria-label={`${statusLabel[status]}: ${step}`}>
        {status === 'done' ? <Icon name="check" size={18} /> : step}
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
        {children}
      </div>
    </div>
  )
}
