import { MetricCard, MetricGrid } from '@/design-system'
import { formatNumber } from '@/lib/format'
import type { Donation, DonorReport } from '@/types/domain'

const sentimentLabel: Record<DonorReport['sentimentSummary'], string> = {
  positive: 'Predominantemente positivo',
  negative: 'Predominantemente negativo',
  neutral: 'Neutro',
}

export type DonorReportCardProps = {
  donation: Donation
  report: DonorReport
}

export function DonorReportCard({ donation, report }: DonorReportCardProps) {
  return (
    <section aria-label={`Relatório da doação de R$ ${donation.amountReais}`}>
      <MetricGrid>
        <MetricCard icon="users" label="Beneficiários ativos" value={formatNumber(report.beneficiariesActive)} />
        <MetricCard icon="arrows" label="Tokens circulados" value={formatNumber(report.tokensCirculated)} />
        <MetricCard icon="book" label="Cursos concluídos" value={formatNumber(report.coursesCompleted)} />
        <MetricCard icon="medal" label="Tokens Alma emitidos" value={formatNumber(report.sbtIssued)} />
      </MetricGrid>
      <p>{sentimentLabel[report.sentimentSummary]}</p>
    </section>
  )
}
