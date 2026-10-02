import { PageHeader } from '@/design-system'
import { NotFoundLinks } from './NotFoundLinks'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <main className={styles.page}>
      <PageHeader title="Página não encontrada" description="O endereço pode ter mudado ou não existir mais." />
      <NotFoundLinks />
    </main>
  )
}
