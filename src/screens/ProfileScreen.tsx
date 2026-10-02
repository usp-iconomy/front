import {
  DataTable,
  PageHeader,
  SectionHeader,
  StatBox,
  StatGrid,
  StatusText,
  TokenAmount,
  type Column,
} from '@/design-system'
import { formatDate } from '@/lib/format'
import type { Member, Transaction, WalletSummary } from '@/types/domain'

const kindLabel: Record<Transaction['kind'], string> = {
  sent: 'Enviada',
  received: 'Recebida',
  sbt_issued: 'Token Alma',
}

const statusLabel: Record<Transaction['status'], string> = {
  completed: 'Completo',
  issued: 'Emitido',
  pending: 'Pendente',
}

const columns: readonly Column<Transaction>[] = [
  {
    key: 'date',
    header: 'Data',
    render: (row) => <time dateTime={row.occurredAt}>{formatDate(row.occurredAt)}</time>,
  },
  { key: 'kind', header: 'Tipo', render: (row) => kindLabel[row.kind] },
  { key: 'description', header: 'Descrição', render: (row) => row.description },
  {
    key: 'amount',
    header: 'Valor',
    render: (row) =>
      row.amount === null ? (
        'Não se aplica'
      ) : (
        <TokenAmount value={row.amount} direction={row.kind === 'sent' ? 'outgoing' : 'incoming'} />
      ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <StatusText tone={row.status === 'pending' ? 'neutral' : 'positive'}>{statusLabel[row.status]}</StatusText>
    ),
  },
]

type ProfileScreenProps = {
  member: Member
  wallet: WalletSummary
  transactions: readonly Transaction[]
}

export function ProfileScreen({ wallet, transactions }: ProfileScreenProps) {
  return (
    <>
      <PageHeader
        title="Meu perfil e carteira"
        description="Seu saldo, o que você já fez circular e as certificações que sua participação gerou."
      />

      <StatGrid>
        <StatBox
          icon="wallet"
          label="Tokens UAIFAI"
          value={wallet.tokenBalance}
          caption="Saldo disponível"
        />
        <StatBox
          icon="arrows"
          label="Circulações"
          value={wallet.circulationCount}
          caption="Base do acesso por circulação"
        />
        <StatBox
          icon="medal"
          label="Tokens Alma"
          value={wallet.soulTokenCount}
          caption="Não-transferíveis"
        />
        <StatBox
          icon="star"
          label="Reputação"
          value={'★'.repeat(wallet.reputationStars)}
          caption={wallet.reputationLabel}
        />
      </StatGrid>

      <SectionHeader title="Transações recentes" />
      <DataTable
        caption="Histórico de transações da carteira"
        columns={columns}
        rows={transactions}
        rowKey={(row) => row.id}
      />
    </>
  )
}
