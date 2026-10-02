import Link from 'next/link'
import { Button } from '@/design-system'
import { pathFor } from '@/lib/mode'
import styles from './EntryScreen.module.css'

export type EntryScreenProps = {
  /** Null when nobody is signed in. The name can be missing for a signed-in account. */
  member: { name: string | null } | null
  sessionExpired: boolean
  /** In-app path to land on after signing in. */
  next: string
  actions: {
    signIn: (formData: FormData) => void | Promise<void>
    signUp: () => void | Promise<void>
    signOut: () => void | Promise<void>
  }
}

const DEMO_HELPER_ID = 'entry-demo-helper'

export function EntryScreen({ member, sessionExpired, next, actions }: EntryScreenProps) {
  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <header className={styles.brand}>
          <h1 className={styles.title}>USP Iconomy</h1>
          <p className={styles.slogan}>Conhecimento que circula, transforma</p>
        </header>

        {sessionExpired && (
          <p role="status" className={styles.notice}>
            Sua sessão expirou. Entre de novo para continuar.
          </p>
        )}

        {member === null ? (
          <div className={styles.actions}>
            <form action={actions.signIn}>
              <input type="hidden" name="next" value={next} />
              <Button type="submit" fullWidth>
                Entrar
              </Button>
            </form>
            <form action={actions.signUp}>
              <Button type="submit" variant="secondary" fullWidth>
                Criar conta
              </Button>
            </form>
          </div>
        ) : (
          <div className={styles.actions}>
            <Link href={pathFor('real', '/courses')} className={styles.continueLink}>
              {member.name ? `Continuar como ${member.name}` : 'Continuar'}
            </Link>
            <form action={actions.signOut}>
              <Button type="submit" variant="ghost" fullWidth>
                Sair
              </Button>
            </form>
          </div>
        )}

        <div className={styles.demo}>
          <Link href={pathFor('demo', '/courses')} className={styles.demoLink} aria-describedby={DEMO_HELPER_ID}>
            Explorar demonstração
          </Link>
          <p id={DEMO_HELPER_ID} className={styles.demoHelper}>
            Sem login. Todos os dados são fictícios.
          </p>
        </div>
      </div>
    </main>
  )
}
