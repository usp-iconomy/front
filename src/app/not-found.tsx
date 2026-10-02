import Link from 'next/link'
import { PageHeader } from '@/design-system'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <main className={styles.page}>
      <PageHeader title="Página não encontrada" description="O endereço pode ter mudado ou não existir mais." />
      <nav aria-label="Atalhos" className={styles.links}>
        <Link href="/courses">Ir para os cursos</Link>
        <Link href="/admin">Ir para a administração</Link>
      </nav>
    </main>
  )
}
