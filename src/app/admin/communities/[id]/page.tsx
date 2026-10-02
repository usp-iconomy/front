import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CommunityDetail } from '@/components/admin/CommunityDetail'
import { demoSource } from '@/data/demo/source'
import { canViewTerritorialDetail } from '@/lib/quilombola'

export const metadata: Metadata = { title: 'Comunidade — Administração USP Iconomy' }

export default async function AdminCommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [communities, admin] = await Promise.all([demoSource.listCommunities(), demoSource.getAdmin()])
  if (communities.status !== 'ok' || admin.status !== 'ok' || !admin.data) {
    throw new Error('demo source always answers')
  }
  const community = communities.data.communities.find((candidate) => candidate.id === id)
  if (!community) notFound()

  return (
    <CommunityDetail
      community={community}
      events={communities.data.events.filter((event) => event.communityId === community.id)}
      detailVisible={canViewTerritorialDetail(admin.data.scope, community)}
    />
  )
}
