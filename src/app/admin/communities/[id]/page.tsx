import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CommunityDetail } from '@/components/admin/CommunityDetail'
import { canViewTerritorialDetail } from '@/lib/quilombola'
import { currentAdmin } from '@/mocks/admin'
import { quilombolaCommunities, territorialEvents } from '@/mocks/communities'

export const metadata: Metadata = { title: 'Comunidade — Administração USP Iconomy' }

export default async function AdminCommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const community = quilombolaCommunities.find((candidate) => candidate.id === id)
  if (!community) notFound()

  return (
    <CommunityDetail
      community={community}
      events={territorialEvents.filter((event) => event.communityId === community.id)}
      detailVisible={canViewTerritorialDetail(currentAdmin.scope, community)}
    />
  )
}
