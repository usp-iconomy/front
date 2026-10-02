import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { AdminTokenSettingsScreen } from '@/screens/AdminTokenSettingsScreen'

export const metadata: Metadata = { title: 'Taxas do token — Administração (demonstração) USP Iconomy' }

export default async function AdminTokenSettingsPage() {
  const [admin, rates, communities] = await Promise.all([
    demoSource.getAdmin(),
    demoSource.getTokenRates(),
    demoSource.listCommunities(),
  ])
  if (admin.status !== 'ok' || !admin.data || rates.status !== 'ok' || communities.status !== 'ok') {
    throw new Error('demo source always answers')
  }
  return (
    <AdminTokenSettingsScreen
      scope={admin.data.scope}
      rates={rates.data}
      communities={communities.data.communities.map(({ id, name }) => ({ id, name }))}
    />
  )
}
