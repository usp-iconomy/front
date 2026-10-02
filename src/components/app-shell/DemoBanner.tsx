import Link from 'next/link'
import styles from './DemoBanner.module.css'

export function DemoBanner() {
  return (
    <div role="note" className={styles.banner}>
      <span className={styles.label}>Demonstração · dados fictícios</span>
      <Link href="/" className={styles.exit}>
        Sair da demonstração
      </Link>
    </div>
  )
}
