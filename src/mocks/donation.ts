import type { Donation, DonorReport } from '@/types/domain'

export const donations: readonly Donation[] = [
  {
    id: 'don-1',
    amountReais: 100,
    community: 'quilombola',
    tokensGenerated: 500,
    distributionCodesCount: 4,
    createdAt: '2026-07-15T10:00:00Z',
  },
  {
    id: 'don-2',
    amountReais: 30,
    community: 'peripheral',
    tokensGenerated: 150,
    distributionCodesCount: 1,
    createdAt: '2026-08-02T09:30:00Z',
  },
]

const donorReports: readonly DonorReport[] = [
  {
    donationId: 'don-1',
    beneficiariesActive: 12,
    tokensCirculated: 380,
    coursesCompleted: 6,
    sbtIssued: 6,
    sentimentSummary: 'positive',
  },
  {
    donationId: 'don-2',
    beneficiariesActive: 3,
    tokensCirculated: 90,
    coursesCompleted: 1,
    sbtIssued: 1,
    sentimentSummary: 'positive',
  },
]

export function reportForDonation(donationId: string): DonorReport | undefined {
  return donorReports.find((report) => report.donationId === donationId)
}
