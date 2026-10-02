'use client'

import { useState } from 'react'
import { Chip, DataTable, StatusText, type Column } from '@/design-system'
import {
  REVIEW_NOTE_MIN_LENGTH,
  applyReviewDecision,
  reviewQueue,
  reviewStatusPresentation,
  reviewStatuses,
  submittedAt,
} from '@/lib/course-review'
import { formatDate } from '@/lib/format'
import type { CourseReviewStatus, CourseSubmission, ReviewDecision } from '@/types/domain'
import { CourseReviewPanel } from './CourseReviewPanel'
import styles from './CourseReviewWorkspace.module.css'

const emptyQueue: Record<CourseReviewStatus, string> = {
  pending_review: 'Nenhum curso esperando revisão. Cursos enviados por docentes aparecem aqui.',
  changes_requested: 'Nenhum curso com ajustes pendentes.',
  published: 'Nenhum curso publicado por esta fila ainda.',
  rejected: 'Nenhum curso rejeitado.',
}

function announcementFor(title: string, status: CourseReviewStatus): string {
  switch (status) {
    case 'published':
      return `"${title}" foi aprovado e publicado.`
    case 'changes_requested':
      return `Ajustes pedidos para "${title}". O comentário ficou no histórico.`
    case 'rejected':
      return `"${title}" foi rejeitado. O comentário ficou no histórico.`
    case 'pending_review':
      return ''
  }
}

export type CourseReviewWorkspaceProps = {
  initialSubmissions: readonly CourseSubmission[]
  reviewerName: string
}

export function CourseReviewWorkspace({ initialSubmissions, reviewerName }: CourseReviewWorkspaceProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [filter, setFilter] = useState<CourseReviewStatus>('pending_review')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const queue = reviewQueue(submissions, filter)
  const selected = submissions.find((submission) => submission.course.id === selectedId) ?? null

  function handleDecide(decision: ReviewDecision): string | null {
    if (!selected) return null
    const result = applyReviewDecision(selected, decision, reviewerName, new Date().toISOString())
    if (!result.ok) {
      return result.error === 'note_too_short'
        ? `Escreva pelo menos ${REVIEW_NOTE_MIN_LENGTH} caracteres explicando a decisão.`
        : 'Este curso já saiu da fila de revisão.'
    }
    setSubmissions((current) =>
      current.map((submission) => (submission.course.id === selected.course.id ? result.submission : submission)),
    )
    setSelectedId(null)
    setAnnouncement(announcementFor(selected.course.title, result.submission.status))
    return null
  }

  const columns: readonly Column<CourseSubmission>[] = [
    {
      key: 'title',
      header: 'Curso',
      render: (row) => (
        <button
          type="button"
          className={styles.rowButton}
          aria-current={row.course.id === selectedId ? 'true' : undefined}
          onClick={() => setSelectedId(row.course.id)}
        >
          {row.course.title}
        </button>
      ),
    },
    { key: 'sender', header: 'Enviado por', render: (row) => row.submittedBy },
    {
      key: 'submitted',
      header: 'Enviado em',
      render: (row) => <time dateTime={submittedAt(row)}>{formatDate(submittedAt(row))}</time>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const presentation = reviewStatusPresentation[row.status]
        return (
          <StatusText tone={presentation.tone} icon={presentation.icon}>
            {presentation.label}
          </StatusText>
        )
      },
    },
  ]

  return (
    <div>
      <div className={styles.filters} role="group" aria-label="Filtrar por status">
        {reviewStatuses.map((status) => (
          <Chip
            key={status}
            active={filter === status}
            onClick={() => {
              setFilter(status)
              setSelectedId(null)
            }}
          >
            {`${reviewStatusPresentation[status].label} (${reviewQueue(submissions, status).length})`}
          </Chip>
        ))}
      </div>

      <p role="status" className={styles.announcement}>
        {announcement}
      </p>

      <div className={selected ? styles.split : undefined}>
        {queue.length === 0 ? (
          <p className={styles.empty}>{emptyQueue[filter]}</p>
        ) : (
          <DataTable
            caption="Cursos enviados para revisão"
            columns={columns}
            rows={queue}
            rowKey={(row) => row.course.id}
          />
        )}

        {selected && (
          <CourseReviewPanel
            key={selected.course.id}
            submission={selected}
            onDecide={handleDecide}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  )
}
