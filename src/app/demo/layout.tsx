import type { ReactNode } from 'react'
import { DemoBanner } from '@/components/app-shell/DemoBanner'
import styles from './layout.module.css'

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.demo}>
      <DemoBanner />
      {children}
    </div>
  )
}
