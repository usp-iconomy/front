import type { Metadata } from 'next'
import { Divider, PageHeader, SectionHeader } from '@/design-system'
import { formatDate } from '@/lib/format'
import { DonorReportCard } from '@/components/donation/DonorReportCard'
import { donations, reportForDonation } from '@/mocks/donation'

export const metadata: Metadata = { title: 'Minhas doações — USP Iconomy' }

export default function DonationHistoryPage() {
  return (
    <>
      <PageHeader
        title="Minhas doações"
        description="O impacto de cada doação, atualizado com base nos Tokens Alma emitidos e na circulação da comunidade beneficiada."
      />

      {donations.map((donation) => {
        const report = reportForDonation(donation.id)
        if (!report) return null

        return (
          <section key={donation.id}>
            <SectionHeader title={`R$ ${donation.amountReais} — ${formatDate(donation.createdAt)}`} />
            <DonorReportCard donation={donation} report={report} />
            <Divider />
          </section>
        )
      })}
    </>
  )
}
