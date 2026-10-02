import { describe, expect, it } from 'vitest'
import type { Course, CourseSubmission } from '@/types/domain'
import { applyReviewDecision, reviewQueue } from './course-review'

const course: Course = {
  id: 'cartografia-social',
  title: 'Cartografia Social',
  instructor: 'Profa. Lia Ramos',
  description: 'Mapeamento participativo de territórios.',
  accessTypes: ['open'],
  participants: 0,
  workloadHours: 10,
  issuesSbt: true,
  inPerson: false,
}

const pending: CourseSubmission = {
  course,
  submittedBy: 'Profa. Lia Ramos',
  status: 'pending_review',
  history: [{ status: 'pending_review', at: '2026-09-28T12:00:00Z', actorName: 'Profa. Lia Ramos' }],
}

const at = '2026-10-02T15:00:00Z'

describe('applyReviewDecision', () => {
  it('publishes a pending course and records who decided', () => {
    const result = applyReviewDecision(pending, { kind: 'approve' }, 'Helena Prado', at)
    expect(result).toEqual({
      ok: true,
      submission: {
        ...pending,
        status: 'published',
        history: [...pending.history, { status: 'published', at, actorName: 'Helena Prado' }],
      },
    })
  })

  it('refuses to ask for changes without a usable note', () => {
    expect(applyReviewDecision(pending, { kind: 'request_changes', note: 'ajustar' }, 'Helena Prado', at)).toEqual({
      ok: false,
      error: 'note_too_short',
    })
  })

  it('measures the note without surrounding whitespace', () => {
    expect(applyReviewDecision(pending, { kind: 'reject', note: '    curto      ' }, 'Helena Prado', at)).toEqual({
      ok: false,
      error: 'note_too_short',
    })
  })

  it('stores the trimmed note on rejection', () => {
    const result = applyReviewDecision(
      pending,
      { kind: 'reject', note: '  Conteúdo fora do escopo da plataforma.  ' },
      'Helena Prado',
      at,
    )
    expect(result.ok && result.submission.status).toBe('rejected')
    expect(result.ok && result.submission.history.at(-1)?.note).toBe('Conteúdo fora do escopo da plataforma.')
  })

  it('refuses a second decision on a course that already left the queue', () => {
    const first = applyReviewDecision(pending, { kind: 'approve' }, 'Helena Prado', at)
    if (!first.ok) throw new Error('first decision should succeed')
    expect(applyReviewDecision(first.submission, { kind: 'approve' }, 'Helena Prado', at)).toEqual({
      ok: false,
      error: 'not_pending',
    })
  })
})

describe('reviewQueue', () => {
  it('lists one status, oldest submission first', () => {
    const later: CourseSubmission = {
      ...pending,
      course: { ...course, id: 'later' },
      history: [{ status: 'pending_review', at: '2026-09-30T12:00:00Z', actorName: 'Prof. X' }],
    }
    const published: CourseSubmission = { ...pending, course: { ...course, id: 'done' }, status: 'published' }

    expect(reviewQueue([later, published, pending], 'pending_review').map((s) => s.course.id)).toEqual([
      'cartografia-social',
      'later',
    ])
  })
})
