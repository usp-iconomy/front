import type { IconName } from '@/design-system'
import type {
  CourseReviewEvent,
  CourseReviewStatus,
  CourseSubmission,
  ReviewDecision,
} from '@/types/domain'

/** Same floor RN-02 sets for transfer messages. */
export const REVIEW_NOTE_MIN_LENGTH = 10

export type ReviewResult =
  | { ok: true; submission: CourseSubmission }
  | { ok: false; error: 'not_pending' | 'note_too_short' }

const statusAfter: Record<ReviewDecision['kind'], CourseReviewStatus> = {
  approve: 'published',
  request_changes: 'changes_requested',
  reject: 'rejected',
}

export function applyReviewDecision(
  submission: CourseSubmission,
  decision: ReviewDecision,
  actorName: string,
  at: string,
): ReviewResult {
  if (submission.status !== 'pending_review') return { ok: false, error: 'not_pending' }

  const status = statusAfter[decision.kind]
  let event: CourseReviewEvent = { status, at, actorName }

  if (decision.kind !== 'approve') {
    const note = decision.note.trim()
    if (note.length < REVIEW_NOTE_MIN_LENGTH) return { ok: false, error: 'note_too_short' }
    event = { ...event, note }
  }

  return { ok: true, submission: { ...submission, status, history: [...submission.history, event] } }
}

export function submittedAt(submission: CourseSubmission): string {
  return submission.history[0]?.at ?? ''
}

export function reviewQueue(
  submissions: readonly CourseSubmission[],
  status: CourseReviewStatus,
): readonly CourseSubmission[] {
  return submissions
    .filter((submission) => submission.status === status)
    .sort((a, b) => submittedAt(a).localeCompare(submittedAt(b)))
}

export const reviewStatuses: readonly CourseReviewStatus[] = [
  'pending_review',
  'changes_requested',
  'published',
  'rejected',
]

export const reviewStatusPresentation: Record<
  CourseReviewStatus,
  { label: string; tone: 'positive' | 'neutral' | 'negative'; icon: IconName }
> = {
  pending_review: { label: 'Aguardando revisão', tone: 'neutral', icon: 'search' },
  changes_requested: { label: 'Ajustes pedidos', tone: 'neutral', icon: 'doc' },
  published: { label: 'Publicado', tone: 'positive', icon: 'check' },
  rejected: { label: 'Rejeitado', tone: 'negative', icon: 'lock' },
}
