'use client'

import { ModeLink } from '@/components/app-shell/ModeLink'
import styles from './not-found.module.css'

// The root 404 serves both trees, so the shortcuts follow the visitor's tree.
export function NotFoundLinks() {
  return (
    <nav aria-label="Atalhos" className={styles.links}>
      <ModeLink href="/courses">Ir para os cursos</ModeLink>
      <ModeLink href="/admin">Ir para a administração</ModeLink>
    </nav>
  )
}
