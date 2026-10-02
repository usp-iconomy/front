'use client'

import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Button, Input } from '@/design-system'
import {
  validateDraft,
  type DistributionCodeDraft,
  type DraftField,
  type NewDistributionCode,
} from '@/lib/distribution-codes'
import styles from './DistributionCodeForm.module.css'

export type CourseOption = { id: string; title: string }

const emptyDraft: DistributionCodeDraft = {
  name: '',
  tokensPerRedemption: '200',
  maxRedemptions: '',
  validFrom: '',
  validUntil: '',
  courseId: '',
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

export type DistributionCodeFormProps = {
  courses: readonly CourseOption[]
  now: number
  onCreate: (value: NewDistributionCode) => void
  onCancel: () => void
}

export function DistributionCodeForm({ courses, now, onCreate, onCancel }: DistributionCodeFormProps) {
  const id = useId()
  const [draft, setDraft] = useState(emptyDraft)
  const [errors, setErrors] = useState<Partial<Record<DraftField, string>>>({})
  const errorCount = Object.keys(errors).length

  function update(key: keyof DistributionCodeDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function describedBy(field: DraftField): string | undefined {
    return errors[field] ? `${id}-${field}-error` : undefined
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateDraft(draft, now)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    onCreate(result.value)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate aria-label="Novo código de distribuição">
      <Field id={`${id}-name`} label="Nome do código" error={errors.name}>
        <Input
          id={`${id}-name`}
          value={draft.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy('name')}
          onChange={(event) => update('name', event.target.value)}
        />
      </Field>

      <div className={styles.row}>
        <Field id={`${id}-tokensPerRedemption`} label="Tokens por resgate" error={errors.tokensPerRedemption}>
          <Input
            id={`${id}-tokensPerRedemption`}
            inputMode="numeric"
            value={draft.tokensPerRedemption}
            aria-invalid={Boolean(errors.tokensPerRedemption)}
            aria-describedby={describedBy('tokensPerRedemption')}
            onChange={(event) => update('tokensPerRedemption', event.target.value)}
          />
        </Field>
        <Field id={`${id}-maxRedemptions`} label="Máximo de resgates" error={errors.maxRedemptions}>
          <Input
            id={`${id}-maxRedemptions`}
            inputMode="numeric"
            value={draft.maxRedemptions}
            aria-invalid={Boolean(errors.maxRedemptions)}
            aria-describedby={describedBy('maxRedemptions')}
            onChange={(event) => update('maxRedemptions', event.target.value)}
          />
        </Field>
      </div>

      <div className={styles.row}>
        <Field id={`${id}-validFrom`} label="Válido a partir de" error={errors.validFrom}>
          <Input
            id={`${id}-validFrom`}
            type="date"
            value={draft.validFrom}
            aria-invalid={Boolean(errors.validFrom)}
            aria-describedby={describedBy('validFrom')}
            onChange={(event) => update('validFrom', event.target.value)}
          />
        </Field>
        <Field id={`${id}-validUntil`} label="Válido até" error={errors.validUntil}>
          <Input
            id={`${id}-validUntil`}
            type="date"
            value={draft.validUntil}
            aria-invalid={Boolean(errors.validUntil)}
            aria-describedby={describedBy('validUntil')}
            onChange={(event) => update('validUntil', event.target.value)}
          />
        </Field>
      </div>

      <Field id={`${id}-course`} label="Curso vinculado (opcional)">
        <select
          id={`${id}-course`}
          className={styles.select}
          value={draft.courseId}
          onChange={(event) => update('courseId', event.target.value)}
        >
          <option value="">Nenhum</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </Field>

      <p role="status" className={styles.summary}>
        {errorCount === 0 ? '' : errorCount === 1 ? 'Corrija o campo destacado.' : `Corrija os ${errorCount} campos destacados.`}
      </p>

      <div className={styles.actions}>
        <Button type="submit">Criar código</Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
