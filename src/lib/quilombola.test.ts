import { describe, expect, it } from 'vitest'
import type { QuilombolaCommunity, TerritorialEvent } from '@/types/domain'
import {
  canViewTerritorialDetail,
  collectiveMemoryCsv,
  participationByLocality,
  sbtsByMember,
  totalParticipations,
} from './quilombola'

const kalunga: QuilombolaCommunity = {
  id: 'kalunga',
  name: 'Quilombo Kalunga',
  territory: 'Cavalcante, GO',
  members: 120,
  dataSharingConsent: false,
}

function event(id: string, locality: string, occurredAt: string, names: readonly string[]): TerritorialEvent {
  return {
    id,
    communityId: 'kalunga',
    name: `Evento ${id}`,
    activityType: 'Oficina',
    occurredAt,
    organizer: 'Benedita Souza',
    locality,
    coordinates: { lat: -13.7963, lng: -47.4581 },
    participants: names.map((name) => ({ memberId: name.toLowerCase(), name })),
  }
}

const events = [
  event('b', 'Vão de Almas', '2026-09-20T13:00:00Z', ['Ana', 'Rosa']),
  event('a', 'Engenho II', '2026-08-10T13:00:00Z', ['Ana', 'Rosa', 'Zeca']),
  event('c', 'Engenho II', '2026-09-28T13:00:00Z', ['Ana']),
]

describe('canViewTerritorialDetail', () => {
  it('lets the community admin see their own community', () => {
    expect(canViewTerritorialDetail({ kind: 'quilombola', communityId: 'kalunga' }, kalunga)).toBe(true)
  })

  it('keeps another community admin out', () => {
    expect(canViewTerritorialDetail({ kind: 'quilombola', communityId: 'ivaporunduva' }, kalunga)).toBe(false)
  })

  it('shows USP the detail only with the community consent (RN-09)', () => {
    expect(canViewTerritorialDetail({ kind: 'usp' }, kalunga)).toBe(false)
    expect(canViewTerritorialDetail({ kind: 'usp' }, { ...kalunga, dataSharingConsent: true })).toBe(true)
  })
})

describe('participationByLocality', () => {
  it('adds events and participations per locality, busiest first', () => {
    expect(participationByLocality(events)).toEqual([
      { locality: 'Engenho II', events: 2, participations: 4 },
      { locality: 'Vão de Almas', events: 1, participations: 2 },
    ])
  })
})

describe('sbtsByMember', () => {
  it('counts one SBT per event attended', () => {
    expect(sbtsByMember(events)).toEqual([
      { memberId: 'ana', name: 'Ana', sbtCount: 3 },
      { memberId: 'rosa', name: 'Rosa', sbtCount: 2 },
      { memberId: 'zeca', name: 'Zeca', sbtCount: 1 },
    ])
  })
})

describe('totalParticipations', () => {
  it('sums participants across events', () => {
    expect(totalParticipations(events)).toBe(6)
  })
})

describe('collectiveMemoryCsv', () => {
  it('lists events oldest first with numeric coordinates', () => {
    const lines = collectiveMemoryCsv(events).split('\r\n')
    expect(lines[0]).toBe('data,evento,tipo,localidade,organizador,latitude,longitude,participantes')
    expect(lines[1]).toContain('Evento a,Oficina,Engenho II,Benedita Souza,-13.79630,-47.45810,3')
    expect(lines).toHaveLength(4)
  })
})
