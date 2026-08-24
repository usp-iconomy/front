import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Donation, DonorReport } from '@/types/domain'
import { DonorReportCard } from './DonorReportCard'

const donation: Donation = {
  id: 'don-1',
  amountReais: 100,
  community: 'quilombola',
  tokensGenerated: 500,
  distributionCodesCount: 4,
  createdAt: '2026-07-15T10:00:00Z',
}

const report: DonorReport = {
  donationId: 'don-1',
  beneficiariesActive: 12,
  tokensCirculated: 380,
  coursesCompleted: 6,
  sbtIssued: 4,
  sentimentSummary: 'positive',
}

describe('DonorReportCard', () => {
  it('renders the four headline metrics and the sentiment summary', () => {
    render(<DonorReportCard donation={donation} report={report} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('380')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText(/predominantemente positivo/i)).toBeInTheDocument()
  })
})
