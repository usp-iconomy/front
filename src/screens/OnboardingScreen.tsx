'use client'

import { useActionState, useId, useState, type FormEvent } from 'react'
import { Button } from '@/design-system'
import { EMPTY_CHOICE_MESSAGE } from '@/lib/onboarding'
import styles from './OnboardingScreen.module.css'

export type OnboardingRole = 'student' | 'teacher' | 'donor'
/** `role` is what was submitted, so the choice survives React's form reset after the action. */
export type OnboardingState = { error: string | null; role: OnboardingRole | null }
export type OnboardingAction = (state: OnboardingState, formData: FormData) => Promise<OnboardingState>

// Administration is never self-assigned; the API rejects it.
const options: readonly { role: OnboardingRole; label: string; description: string }[] = [
  { role: 'student', label: 'Estudante', description: 'Fazer cursos e circular tokens' },
  { role: 'teacher', label: 'Docência', description: 'Oferecer cursos à comunidade' },
  { role: 'donor', label: 'Doação', description: 'Financiar bolsas para quem não tem histórico' },
]

const initialState: OnboardingState = { error: null, role: null }

export function OnboardingScreen({ action }: { action: OnboardingAction }) {
  const id = useId()
  const [state, formAction, pending] = useActionState(action, initialState)
  const [emptyChoice, setEmptyChoice] = useState(false)

  // The button stays enabled so the form also works before hydration; the action repeats this check.
  function guardEmptyChoice(event: FormEvent<HTMLFormElement>) {
    if (new FormData(event.currentTarget).get('role')) return
    event.preventDefault()
    setEmptyChoice(true)
  }

  return (
    <main className={styles.page}>
      <form action={formAction} onSubmit={guardEmptyChoice} className={styles.form}>
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
                // Uncontrolled: React resets the form after each action, back to these defaults.
                defaultChecked={state.role === option.role}
                onChange={() => setEmptyChoice(false)}
                aria-labelledby={`${id}-${option.role}-label`}
                aria-describedby={`${id}-${option.role}-description`}
                className={styles.radio}
              />
              <span className={styles.optionText}>
                <span id={`${id}-${option.role}-label`} className={styles.optionLabel}>
                  {option.label}
                </span>
                <span id={`${id}-${option.role}-description`} className={styles.optionDescription}>
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <p role="status" className={styles.error}>
          {emptyChoice ? EMPTY_CHOICE_MESSAGE : state.error}
        </p>
        <Button type="submit" fullWidth disabled={pending}>
          Continuar
        </Button>
      </form>
    </main>
  )
}
