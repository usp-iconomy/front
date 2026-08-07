import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { SiteHeader } from './SiteHeader'
import styles from './AppShell.module.css'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a href="#conteudo" className={styles.skipLink}>
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      <BottomNav />
    </div>
  )
}
