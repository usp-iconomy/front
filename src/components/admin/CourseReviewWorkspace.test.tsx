import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Course, CourseSubmission } from '@/types/domain'
import { CourseReviewWorkspace } from './CourseReviewWorkspace'

function submission(id: string, title: string, submitted: string, status: CourseSubmission['status']): CourseSubmission {
  const course: Course = {
    id,
    title,
    instructor: 'Profa. Lia Ramos',
    description: 'Descrição do curso.',
    accessTypes: ['open'],
    participants: 0,
    workloadHours: 10,
    issuesSbt: true,
    inPerson: false,
  }
  return {
    course,
    submittedBy: 'Profa. Lia Ramos',
    status,
    history: [{ status: 'pending_review', at: submitted, actorName: 'Profa. Lia Ramos' }],
  }
}

const submissions = [
  submission('b', 'Agroecologia Urbana', '2026-09-30T12:00:00Z', 'pending_review'),
  submission('a', 'Cartografia Social', '2026-09-28T12:00:00Z', 'pending_review'),
  submission('c', 'Memória Oral', '2026-09-20T12:00:00Z', 'published'),
]

describe('CourseReviewWorkspace', () => {
  it('lists pending courses oldest first', () => {
    render(<CourseReviewWorkspace initialSubmissions={submissions} reviewerName="Helena Prado" />)
    const titles = screen.getAllByRole('button', { name: /cartografia social|agroecologia urbana/i })
    expect(titles.map((button) => button.textContent)).toEqual(['Cartografia Social', 'Agroecologia Urbana'])
  })

  it('opens the course beside the queue and moves focus to it', async () => {
    const user = userEvent.setup()
    render(<CourseReviewWorkspace initialSubmissions={submissions} reviewerName="Helena Prado" />)

    await user.click(screen.getByRole('button', { name: 'Cartografia Social' }))

    expect(screen.getByRole('heading', { name: 'Cartografia Social' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Cartografia Social' })).toHaveAttribute('aria-current', 'true')
  })

  it('publishes an approved course and takes it out of the pending queue', async () => {
    const user = userEvent.setup()
    render(<CourseReviewWorkspace initialSubmissions={submissions} reviewerName="Helena Prado" />)

    await user.click(screen.getByRole('button', { name: 'Cartografia Social' }))
    await user.click(screen.getByRole('button', { name: 'Publicar curso' }))

    expect(await screen.findByText('"Cartografia Social" foi aprovado e publicado.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cartografia Social' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publicado (2)' })).toBeInTheDocument()
  })

  it('keeps the course pending when changes are requested without a usable comment', async () => {
    const user = userEvent.setup()
    render(<CourseReviewWorkspace initialSubmissions={submissions} reviewerName="Helena Prado" />)

    await user.click(screen.getByRole('button', { name: 'Cartografia Social' }))
    await user.click(screen.getByRole('radio', { name: 'Pedir ajustes' }))
    await user.type(screen.getByLabelText('Comentário para quem enviou'), 'curto')
    await user.click(screen.getByRole('button', { name: 'Pedir ajustes' }))

    expect(await screen.findByText(/pelo menos 10 caracteres/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Aguardando revisão (2)' })).toBeInTheDocument()
  })

  it('offers no decision on a course that already left the queue', async () => {
    const user = userEvent.setup()
    render(<CourseReviewWorkspace initialSubmissions={submissions} reviewerName="Helena Prado" />)

    await user.click(screen.getByRole('button', { name: 'Publicado (1)' }))
    await user.click(screen.getByRole('button', { name: 'Memória Oral' }))

    expect(screen.getByText(/decisão já registrada/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publicar curso' })).not.toBeInTheDocument()
  })

  it('says what would fill an empty filter', async () => {
    const user = userEvent.setup()
    render(<CourseReviewWorkspace initialSubmissions={submissions} reviewerName="Helena Prado" />)

    await user.click(screen.getByRole('button', { name: 'Rejeitado (0)' }))

    expect(screen.getByText(/nenhum curso rejeitado/i)).toBeInTheDocument()
  })
})
