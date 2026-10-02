import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { QuilombolaCommunity, TerritorialEvent } from '@/types/domain'
import { CommunityDetail } from './CommunityDetail'

const community: QuilombolaCommunity = {
  id: 'kalunga',
  name: 'Quilombo Kalunga',
  territory: 'Cavalcante, GO',
  members: 120,
  dataSharingConsent: false,
}

const events: readonly TerritorialEvent[] = [
  {
    id: 'e1',
    communityId: 'kalunga',
    name: 'Assembleia de setembro',
    activityType: 'Assembleia',
    occurredAt: '2026-09-20T13:00:00Z',
    organizer: 'Benedita Souza',
    locality: 'Engenho II',
    coordinates: { lat: -13.7963, lng: -47.4581 },
    participants: [{ memberId: 'ana', name: 'Ana' }],
  },
]

describe('CommunityDetail', () => {
  it('shows only aggregates and explains why when detail is restricted', () => {
    render(<CommunityDetail community={community} events={events} detailVisible={false} />)
    expect(screen.getByText(/dados territoriais restritos/i)).toBeInTheDocument()
    expect(screen.queryByText('Assembleia de setembro')).not.toBeInTheDocument()
    expect(screen.queryByText('Engenho II')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /exportar/i })).not.toBeInTheDocument()
  })

  it('shows events, localities and the export when detail is visible', () => {
    render(<CommunityDetail community={community} events={events} detailVisible />)
    expect(screen.getByText('Assembleia de setembro')).toBeInTheDocument()
    expect(screen.getAllByText('Engenho II').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument()
  })

  it('speaks in Token Alma and singular members', () => {
    render(<CommunityDetail community={{ ...community, members: 1 }} events={events} detailVisible />)
    expect(screen.getByText(/Cavalcante, GO · 1 membro$/)).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Eventos presenciais com Token Alma' })).toBeInTheDocument()
  })
})
