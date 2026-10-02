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
      <p className={styles.eyebrow}>Em construção</p>
      <PageHeader title={title} description="Esta área ainda não está ligada ao servidor." />
      <Link href={demoPath} className={styles.demoLink}>
        Ver na demonstração
      </Link>
    </section>
  )
}
