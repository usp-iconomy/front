import Link from 'next/link'
import { PageHeader } from '@/design-system'
import styles from './UnderConstruction.module.css'

export type UnderConstructionProps = {
  title: string
  /** The same screen under `/demo`. */
  demoPath: string
}

/** A real-mode area without a backend endpoint. Shows no data at all, fictitious or otherwise. */
export function UnderConstruction({ title, demoPath }: UnderConstructionProps) {
  return (
    <section className={styles.section}>
      <PageHeader title={title} description="Esta área ainda está em construção e não está ligada ao servidor." />
      <Link href={demoPath} className={styles.demoLink}>
        Ver na demonstração
      </Link>
    </section>
  )
}
