import type { Metadata } from 'next'
import {
  DataTable,
  InfoBox,
  PageHeader,
  SectionHeader,
  StatBox,
  StatGrid,
  TokenAmount,
  type Column,
} from '@/design-system'
import { SentimentBreakdown } from '@/components/admin/SentimentBreakdown'
import {
  UNPAID_DEGREES_MAX_SENT_RATIO,
  rankCourses,
  sentimentShares,
  topContributors,
  unpaidDegrees,
  velocity,
  velocityCaption,
} from '@/lib/community-analysis'
import { formatDate, formatDecimal, formatNumber } from '@/lib/format'
import { communityAnalysis } from '@/mocks/admin-analysis'
import type { CourseCirculation, MemberCirculation } from '@/types/domain'

export const metadata: Metadata = { title: 'Visão geral — Administração USP Iconomy' }

const memberColumns: readonly Column<MemberCirculation>[] = [
  { key: 'name', header: 'Membro', render: (row) => row.name },
  { key: 'balance', header: 'Saldo', render: (row) => <TokenAmount value={row.balance} /> },
  { key: 'sent', header: 'Enviado no período', render: (row) => <TokenAmount value={row.sent} /> },
]

const courseColumns: readonly Column<CourseCirculation>[] = [
  { key: 'title', header: 'Curso', render: (row) => row.title },
  { key: 'tokens', header: 'Tokens circulados', render: (row) => <TokenAmount value={row.tokensCirculated} /> },
]

export default function AdminOverviewPage() {
  const analysis = communityAnalysis
  const currentVelocity = velocity(analysis.tokensCirculated, analysis.totalSupply)
  const hoarders = unpaidDegrees(analysis.members)
  const thresholdPercent = UNPAID_DEGREES_MAX_SENT_RATIO * 100

  return (
    <>
      <PageHeader
        title="Visão geral da comunidade"
        description={`De ${formatDate(analysis.periodStart)} a ${formatDate(analysis.periodEnd)}, pela análise de comunidade (Community Analysis) do Peace Coin Explorer.`}
      />

      <StatGrid>
        <StatBox
          icon="arrows"
          label="Velocidade de circulação"
          value={formatDecimal(currentVelocity)}
          caption={velocityCaption(currentVelocity)}
        />
        <StatBox icon="chart" label="Tokens circulados" value={formatNumber(analysis.tokensCirculated)} />
        <StatBox icon="wallet" label="Tokens em existência" value={formatNumber(analysis.totalSupply)} />
        <StatBox icon="users" label="Membros analisados" value={formatNumber(analysis.members.length)} />
      </StatGrid>

      <SectionHeader title="Sentimento das mensagens" />
      <SentimentBreakdown shares={sentimentShares(analysis.sentimentCounts)} counts={analysis.sentimentCounts} />

      <SectionHeader title="Saldos parados (Unpaid-Degrees)" />
      {hoarders.length === 0 ? (
        <p>Ninguém ficou com saldo parado neste período.</p>
      ) : (
        <>
          <InfoBox
            title={hoarders.length === 1 ? '1 pessoa com saldo parado' : `${hoarders.length} pessoas com saldo parado`}
            icon="shield"
          >
            {`Têm saldo e enviaram menos de ${thresholdPercent}% dele no período. O decaimento semanal já está reduzindo esses saldos, então este é o momento de um contato.`}
          </InfoBox>
          <DataTable
            caption="Membros com saldo parado"
            columns={memberColumns}
            rows={hoarders}
            rowKey={(row) => row.memberId}
          />
        </>
      )}

      <SectionHeader title="Quem mais circulou" />
      <DataTable
        caption="Membros que mais enviaram tokens no período"
        columns={memberColumns}
        rows={topContributors(analysis.members)}
        rowKey={(row) => row.memberId}
      />

      <SectionHeader title="Cursos com maior circulação" />
      <DataTable
        caption="Ranking de engajamento por curso"
        columns={courseColumns}
        rows={rankCourses(analysis.courses)}
        rowKey={(row) => row.courseId}
      />
    </>
  )
}
