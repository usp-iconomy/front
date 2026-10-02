import { Divider, PageHeader, SectionHeader } from '@/design-system'
import { formatDate } from '@/lib/format'
import { DonorReportCard } from '@/components/donation/DonorReportCard'
import type { DonationHistoryEntry } from '@/data/contracts'

export function DonationHistoryScreen({ entries }: { entries: readonly DonationHistoryEntry[] }) {
  return (
    <>
      <PageHeader
        title="Minhas doações"
        description="O impacto de cada doação, atualizado com base nos Tokens Alma emitidos e na circulação da comunidade beneficiada."
      />

      {entries.map(({ donation, report }) => {
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
