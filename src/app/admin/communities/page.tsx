import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { AdminCommunitiesScreen } from '@/screens/AdminCommunitiesScreen'

export const metadata: Metadata = { title: 'Comunidades — Administração USP Iconomy' }

export default async function AdminCommunitiesPage() {
  const communities = await demoSource.listCommunities()
  if (communities.status !== 'ok') throw new Error('demo source always answers')
  return <AdminCommunitiesScreen communities={communities.data.communities} mode="demo" />
}
