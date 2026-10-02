'use client'

import { Button } from '@/design-system'
import styles from './error.module.css'

// Above (signed-in), not in it: a boundary misses its own segment's layout, which is where /auth/me fails first.
export default function RealTreeError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Não conseguimos falar com o servidor agora.</h1>
      <p className={styles.text}>Seus dados estão salvos. Tente de novo em instantes.</p>
      <Button onClick={() => retry()}>Tentar de novo</Button>
    </main>
  )
}
