import Link from 'next/link'
import { PageHeader } from '@/design-system'
import { pathFor } from '@/lib/mode'
import styles from './not-found.module.css'

export default function DemoNotFound() {
  return (
    <main className={styles.page}>
      <PageHeader title="Página não encontrada" description="O endereço pode ter mudado ou não existir mais." />
      <nav aria-label="Atalhos" className={styles.links}>
        <Link href={pathFor('demo', '/courses')}>Ir para os cursos</Link>
        <Link href={pathFor('demo', '/admin')}>Ir para a administração</Link>
      </nav>
    </main>
  )
}
