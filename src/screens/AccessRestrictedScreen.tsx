import Link from 'next/link'
import { Button } from '@/design-system'
import styles from './AccessRestrictedScreen.module.css'

export type AccessRestrictedScreenProps = {
  signOut: () => void | Promise<void>
}

/** What a real-tree route shows when the API answers 403: today, a disabled account. */
export function AccessRestrictedScreen({ signOut }: AccessRestrictedScreenProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Acesso restrito</h1>
      <p className={styles.text}>
        Sua conta está desativada ou sem permissão para esta área. Fale com a administração do USP Iconomy.
      </p>
      <form action={signOut}>
        <Button type="submit">Sair</Button>
      </form>
      <Link href="/" className={styles.home}>
        Voltar para o início
      </Link>
    </main>
  )
}
