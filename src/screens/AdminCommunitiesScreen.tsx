import Link from 'next/link'
import { DataTable, PageHeader, StatusText, type Column } from '@/design-system'
import { formatNumber } from '@/lib/format'
import { pathFor, type Mode } from '@/lib/mode'
import type { QuilombolaCommunity } from '@/types/domain'

type AdminCommunitiesScreenProps = { communities: readonly QuilombolaCommunity[]; mode: Mode }

export function AdminCommunitiesScreen({ communities, mode }: AdminCommunitiesScreenProps) {
  const columns: readonly Column<QuilombolaCommunity>[] = [
    {
      key: 'name',
      header: 'Comunidade',
      render: (row) => <Link href={pathFor(mode, `/admin/communities/${row.id}`)}>{row.name}</Link>,
    },
    { key: 'territory', header: 'Território', render: (row) => row.territory },
    { key: 'members', header: 'Membros', render: (row) => formatNumber(row.members) },
    {
      key: 'consent',
      header: 'Compartilhamento com a USP',
      render: (row) =>
        row.dataSharingConsent ? (
          <StatusText tone="positive">Autorizado</StatusText>
        ) : (
          <StatusText tone="neutral" icon="lock">
            Restrito pela comunidade
          </StatusText>
        ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Comunidades quilombolas"
        description="Cada comunidade decide se a USP pode ver a localização e a identidade territorial dos seus membros."
      />
      <DataTable caption="Comunidades cadastradas" columns={columns} rows={communities} rowKey={(row) => row.id} />
    </>
  )
}
