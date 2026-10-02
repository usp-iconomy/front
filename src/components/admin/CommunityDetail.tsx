import {
  DataTable,
  InfoBox,
  PageHeader,
  SectionHeader,
  StatBox,
  StatGrid,
  type Column,
} from '@/design-system'
import { formatDate, formatNumber } from '@/lib/format'
import {
  collectiveMemoryCsv,
  participationByLocality,
  sbtsByMember,
  totalParticipations,
  type LocalityParticipation,
  type MemberMemory,
} from '@/lib/quilombola'
import type { QuilombolaCommunity, TerritorialEvent } from '@/types/domain'
import { CsvDownloadButton } from './CsvDownloadButton'
import styles from './CommunityDetail.module.css'

const localityColumns: readonly Column<LocalityParticipation>[] = [
  { key: 'locality', header: 'Localidade', render: (row) => row.locality },
  { key: 'events', header: 'Eventos', render: (row) => formatNumber(row.events) },
  { key: 'participations', header: 'Participações', render: (row) => formatNumber(row.participations) },
]

const eventColumns: readonly Column<TerritorialEvent>[] = [
  { key: 'date', header: 'Data', render: (row) => <time dateTime={row.occurredAt}>{formatDate(row.occurredAt)}</time> },
  { key: 'name', header: 'Evento', render: (row) => row.name },
  { key: 'type', header: 'Tipo', render: (row) => row.activityType },
  { key: 'locality', header: 'Localidade', render: (row) => row.locality },
  { key: 'organizer', header: 'Organização', render: (row) => row.organizer },
  {
    key: 'coordinates',
    header: 'Coordenadas',
    render: (row) => `${row.coordinates.lat.toFixed(4)}, ${row.coordinates.lng.toFixed(4)}`,
  },
  { key: 'participants', header: 'Participantes', render: (row) => formatNumber(row.participants.length) },
]

const memberColumns: readonly Column<MemberMemory>[] = [
  { key: 'name', header: 'Membro', render: (row) => row.name },
  { key: 'sbts', header: 'Tokens Alma de eventos', render: (row) => formatNumber(row.sbtCount) },
]

export type CommunityDetailProps = {
  community: QuilombolaCommunity
  events: readonly TerritorialEvent[]
  /** Result of canViewTerritorialDetail for the signed-in admin. */
  detailVisible: boolean
}

export function CommunityDetail({ community, events, detailVisible }: CommunityDetailProps) {
  const chronological = [...events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))

  return (
    <>
      <PageHeader
        title={community.name}
        description={`${formatNumber(community.members)} ${community.members === 1 ? 'membro' : 'membros'} em ${community.territory}`}
      />

      <StatGrid>
        <StatBox icon="globe" label="Eventos presenciais" value={formatNumber(events.length)} />
        <StatBox icon="medal" label="Tokens Alma emitidos" value={formatNumber(totalParticipations(events))} />
        <StatBox icon="users" label="Membros" value={formatNumber(community.members)} />
      </StatGrid>

      {detailVisible ? (
        <>
          <div className={styles.export}>
            <CsvDownloadButton
              filename={`memoria-coletiva-${community.id}.csv`}
              csv={collectiveMemoryCsv(events)}
              label="Exportar para relatórios e editais (CSV)"
            />
          </div>

          <SectionHeader title="Participação por território" />
          <DataTable
            caption="Eventos e participações por localidade"
            columns={localityColumns}
            rows={participationByLocality(events)}
            rowKey={(row) => row.locality}
          />

          <SectionHeader title="Memória coletiva: eventos" />
          <DataTable caption="Eventos presenciais com Token Alma" columns={eventColumns} rows={chronological} rowKey={(row) => row.id} />

          <SectionHeader title="Memória coletiva: membros" />
          <DataTable
            caption="Tokens Alma de eventos por membro"
            columns={memberColumns}
            rows={sbtsByMember(events)}
            rowKey={(row) => row.memberId}
          />
        </>
      ) : (
        <InfoBox title="Dados territoriais restritos" icon="lock">
          A comunidade ainda não autorizou a USP a ver localização e identidade territorial, por isso esta página
          mostra só os totais. O detalhe por evento, localidade e membro aparece quando a administração da comunidade
          autorizar.
        </InfoBox>
      )}
    </>
  )
}
