import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { DistributionCode } from '@/types/domain'
import { DistributionCodeManager } from './DistributionCodeManager'

const codes: readonly DistributionCode[] = [
  {
    code: 'EST2H6W5',
    name: 'Coletivo estudantil FFLCH',
    tokensPerRedemption: 100,
    maxRedemptions: 30,
    redemptionsUsed: 12,
    validFrom: '2026-06-01T03:00:00.000Z',
    validUntil: '2026-09-01T02:59:59.999Z',
  },
]

const courses = [{ id: 'design-comunitario', title: 'Design Comunitário' }]

describe('DistributionCodeManager', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-02T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the derived status of each code', () => {
    render(<DistributionCodeManager initialCodes={codes} courses={courses} />)
    expect(screen.getByText('Expirado')).toBeInTheDocument()
  })

  it('creates a code and announces it', async () => {
    const user = userEvent.setup()
    render(<DistributionCodeManager initialCodes={codes} courses={courses} />)

    await user.click(screen.getByRole('button', { name: /novo código/i }))
    await user.type(screen.getByLabelText(/nome do código/i), 'Quilombo Kalunga, turma 2')
    await user.type(screen.getByLabelText(/máximo de resgates/i), '40')
    fireEvent.change(screen.getByLabelText(/válido a partir de/i), { target: { value: '2026-10-02' } })
    fireEvent.change(screen.getByLabelText(/válido até/i), { target: { value: '2026-12-31' } })
    await user.click(screen.getByRole('button', { name: /criar código/i }))

    expect(await screen.findByText(/^Código [A-HJ-NP-Z2-9]{8} criado\.$/)).toBeInTheDocument()
    expect(screen.getByText('Quilombo Kalunga, turma 2')).toBeInTheDocument()
  })

  it('keeps the form open and says what is missing', async () => {
    const user = userEvent.setup()
    render(<DistributionCodeManager initialCodes={codes} courses={courses} />)

    await user.click(screen.getByRole('button', { name: /novo código/i }))
    await user.click(screen.getByRole('button', { name: /criar código/i }))

    expect(screen.getByText(/dê um nome ao código/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nome do código/i)).toHaveAttribute('aria-invalid', 'true')
  })
})
