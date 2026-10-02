import {
  DataTable,
  MetricCard,
  MetricGrid,
  PageHeader,
  SectionHeader,
  type Column,
  type IconName,
} from '@/design-system'
import { formatDate, formatNumber } from '@/lib/format'
import type { ImpactData } from '@/data/contracts'
import type { ActivityRecord } from '@/types/domain'

const metricIcon: Partial<Record<string, IconName>> = {
  participants: 'users',
  circulating: 'arrows',
  sbts: 'doc',
  courses: 'school',
  communities: 'globe',
  sroi: 'trendUp',
}

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

export function ImpactScreen({ data }: { data: ImpactData }) {
  return (
    <>
      <PageHeader
        title="Dashboard de impacto"
        description="Velocity de circulação, certificações emitidas e retorno social — os números que a comunidade e os doadores acompanham."
      />

      <MetricGrid>
        {data.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            icon={metricIcon[metric.id] ?? 'chart'}
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
        rows={data.activity}
        rowKey={(row) => row.id}
      />
    </>
  )
}
