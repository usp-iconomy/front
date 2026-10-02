import Link from 'next/link'
import styles from './DemoBanner.module.css'

export function DemoBanner() {
  return (
    <div role="note" aria-label="Modo demonstração" className={styles.banner}>
      <Link href="/" className={styles.exit}>
        Sair da demonstração
      </Link>
    </div>
  )
}
