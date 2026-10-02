'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Badge, Button, Card, SectionHeader, Textarea } from '@/design-system'
import { accessTypePresentation } from '@/lib/access-type'
import { REVIEW_NOTE_MIN_LENGTH, reviewStatusPresentation } from '@/lib/course-review'
import { formatDate } from '@/lib/format'
import type { CourseSubmission, ReviewDecision } from '@/types/domain'
import styles from './CourseReviewPanel.module.css'

type DecisionKind = ReviewDecision['kind']

const decisionKinds: readonly DecisionKind[] = ['approve', 'request_changes', 'reject']

const decisionLabel: Record<DecisionKind, string> = {
  approve: 'Aprovar e publicar',
  request_changes: 'Pedir ajustes',
  reject: 'Rejeitar',
}

/** The submit button names the outcome, so the admin never has to re-read the radio. */
const submitLabel: Record<DecisionKind, string> = {
  approve: 'Publicar curso',
  request_changes: 'Pedir ajustes',
  reject: 'Rejeitar curso',
}

export type CourseReviewPanelProps = {
  submission: CourseSubmission
  /** Returns an error message, or null when the decision was applied. */
  onDecide: (decision: ReviewDecision) => string | null
  onClose: () => void
}

export function CourseReviewPanel({ submission, onDecide, onClose }: CourseReviewPanelProps) {
  const id = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [kind, setKind] = useState<DecisionKind>('approve')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { course } = submission

  // The panel renders beside the table; without this, keyboard users stay on the row button.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const decision: ReviewDecision = kind === 'approve' ? { kind } : { kind, note }
    setError(onDecide(decision))
  }

  return (
    <Card as="section" aria-labelledby={`${id}-title`}>
      <div className={styles.header}>
        <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1} className={styles.title}>
          {course.title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <p className={styles.meta}>
        {`${submission.submittedBy} · ${course.workloadHours}h · ${course.inPerson ? 'Presencial' : 'Online'} · ${course.issuesSbt ? 'Emite Token Alma' : 'Sem Token Alma'}`}
      </p>
      <p className={styles.description}>{course.description}</p>
      <ul className={styles.badges} aria-label="Tipos de acesso">
        {course.accessTypes.map((accessType) => (
          <li key={accessType}>
            <Badge tone={accessTypePresentation[accessType].tone}>{accessTypePresentation[accessType].label}</Badge>
          </li>
        ))}
      </ul>

      <SectionHeader title="Histórico" />
      <ol className={styles.history}>
        {submission.history.map((event, index) => (
          <li key={`${event.at}-${index}`}>
            <time dateTime={event.at}>{formatDate(event.at)}</time> · {reviewStatusPresentation[event.status].label} ·{' '}
            {event.actorName}
            {event.note && <blockquote className={styles.note}>{event.note}</blockquote>}
          </li>
        ))}
      </ol>

      {submission.status === 'pending_review' ? (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Decisão</legend>
            {decisionKinds.map((option) => (
              <label key={option} className={styles.option}>
                <input
                  type="radio"
                  name={`${id}-decision`}
                  value={option}
                  checked={kind === option}
                  onChange={() => {
                    setKind(option)
                    setError(null)
                  }}
                />
                {decisionLabel[option]}
              </label>
            ))}
          </fieldset>

          {kind !== 'approve' && (
            <div className={styles.field}>
              <label htmlFor={`${id}-note`} className={styles.label}>
                Comentário para quem enviou
              </label>
              <Textarea
                id={`${id}-note`}
                value={note}
                aria-required="true"
                aria-describedby={`${id}-hint ${id}-feedback`}
                onChange={(event) => setNote(event.target.value)}
              />
              <p id={`${id}-hint`} className={styles.hint}>
                {`Fica registrado no histórico do curso. Mínimo de ${REVIEW_NOTE_MIN_LENGTH} caracteres.`}
              </p>
            </div>
          )}

          <p id={`${id}-feedback`} role="status" className={styles.error}>
            {error}
          </p>
          <Button type="submit" variant={kind === 'reject' ? 'secondary' : 'primary'}>
            {submitLabel[kind]}
          </Button>
        </form>
      ) : (
        <p className={styles.closed}>
          Decisão já registrada. Só cursos aguardando revisão recebem uma nova decisão.
        </p>
      )}
    </Card>
  )
}
