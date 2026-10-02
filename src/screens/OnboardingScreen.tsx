'use client'

import { useActionState, useId, useState } from 'react'
import { Button } from '@/design-system'
import styles from './OnboardingScreen.module.css'

export type OnboardingRole = 'student' | 'teacher' | 'donor'
export type OnboardingState = { error: string | null }
export type OnboardingAction = (state: OnboardingState, formData: FormData) => Promise<OnboardingState>

// Administration is never self-assigned; the API rejects it.
const options: readonly { role: OnboardingRole; label: string; description: string }[] = [
  { role: 'student', label: 'Estudante', description: 'Fazer cursos e circular tokens' },
  { role: 'teacher', label: 'Docência', description: 'Oferecer cursos à comunidade' },
  { role: 'donor', label: 'Doação', description: 'Financiar bolsas para quem não tem histórico' },
]

const initialState: OnboardingState = { error: null }

export function OnboardingScreen({ action }: { action: OnboardingAction }) {
  const id = useId()
  const [state, formAction, pending] = useActionState(action, initialState)
  const [role, setRole] = useState<OnboardingRole | null>(null)

  return (
    <main className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 id={`${id}-title`} className={styles.title}>
          Como você vai usar o USP Iconomy?
        </h1>
        <fieldset aria-labelledby={`${id}-title`} className={styles.options}>
          {options.map((option) => (
            <label key={option.role} className={styles.option}>
              <input
                type="radio"
                name="role"
                value={option.role}
                checked={role === option.role}
                onChange={() => setRole(option.role)}
                aria-describedby={`${id}-${option.role}`}
                className={styles.radio}
              />
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>{option.label}</span>
                <span id={`${id}-${option.role}`} aria-hidden className={styles.optionDescription}>
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <p role="status" className={styles.error}>
          {state.error}
        </p>
        <Button type="submit" fullWidth disabled={role === null || pending}>
          Continuar
        </Button>
      </form>
    </main>
  )
}
