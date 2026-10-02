import type { Metadata } from 'next'
import {
  DataTable,
  MetricCard,
  MetricGrid,
  PageHeader,
  SectionHeader,
  type Column,
} from '@/design-system'
import { formatDate, formatNumber } from '@/lib/format'
import { activityRecords, impactMetrics } from '@/mocks/impact'
import type { ActivityRecord } from '@/types/domain'

export const metadata: Metadata = { title: 'Dashboard de impacto — USP Iconomy' }

const columns: readonly Column<ActivityRecord>[] = [
  {
    key: 'date',
    header: 'Data',
    render: (row) => <time dateTime={row.occurredAt}>{formatDate(row.occurredAt)}</time>,
  },
  { key: 'event', header: 'Evento', render: (row) => row.event },
  { key: 'participants', header: 'Participantes', render: (row) => formatNumber(row.participants) },
  { key: 'impact', header: 'Impacto', render: (row) => row.impact },
]

export default function ImpactPage() {
  return (
    <>
      <PageHeader
        title="Dashboard de impacto"
        description="Velocity de circulação, certificações emitidas e retorno social — os números que a comunidade e os doadores acompanham."
      />

      <MetricGrid>
        {impactMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            delta={metric.delta}
          />
        ))}
      </MetricGrid>

      <SectionHeader title="Histórico de atividade" />
      <DataTable
        caption="Eventos recentes e seu impacto"
        columns={columns}
        rows={activityRecords}
        rowKey={(row) => row.id}
      />
    </>
  )
}
