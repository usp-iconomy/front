import type { Metadata } from 'next'
import Link from 'next/link'
import { DataTable, PageHeader, StatusText, type Column } from '@/design-system'
import { formatNumber } from '@/lib/format'
import { quilombolaCommunities } from '@/mocks/communities'
import type { QuilombolaCommunity } from '@/types/domain'

export const metadata: Metadata = { title: 'Comunidades — Administração USP Iconomy' }

const columns: readonly Column<QuilombolaCommunity>[] = [
  { key: 'name', header: 'Comunidade', render: (row) => <Link href={`/admin/communities/${row.id}`}>{row.name}</Link> },
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

export default function AdminCommunitiesPage() {
  return (
    <>
      <PageHeader
        title="Comunidades quilombolas"
        description="Cada comunidade decide se a USP pode ver a localização e a identidade territorial dos seus membros."
      />
      <DataTable caption="Comunidades cadastradas" columns={columns} rows={quilombolaCommunities} rowKey={(row) => row.id} />
    </>
  )
}
