import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { SiteHeader, type SiteHeaderProps } from './SiteHeader'
import styles from './AppShell.module.css'

type AppShellProps = SiteHeaderProps & { children: ReactNode }

export function AppShell({ children, ...header }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a href="#conteudo" className={styles.skipLink}>
        Pular para o conteúdo
      </a>
      <SiteHeader {...header} />
      <main id="conteudo" className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      <BottomNav />
    </div>
  )
}
