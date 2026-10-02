import type { AdminScope, QuilombolaCommunity, TerritorialEvent } from '@/types/domain'
import { toCsv } from './csv'
import { formatDate } from './format'

/** RN-09: territorial data belongs to the community. */
export function canViewTerritorialDetail(scope: AdminScope, community: QuilombolaCommunity): boolean {
  if (scope.kind === 'quilombola') return scope.communityId === community.id
  return community.dataSharingConsent
}

export type LocalityParticipation = { locality: string; events: number; participations: number }

export function participationByLocality(events: readonly TerritorialEvent[]): readonly LocalityParticipation[] {
  const byLocality = new Map<string, LocalityParticipation>()
  for (const event of events) {
    const current = byLocality.get(event.locality) ?? { locality: event.locality, events: 0, participations: 0 }
    byLocality.set(event.locality, {
      ...current,
      events: current.events + 1,
      participations: current.participations + event.participants.length,
    })
  }
  return [...byLocality.values()].sort(
    (a, b) => b.participations - a.participations || a.locality.localeCompare(b.locality, 'pt-BR'),
  )
}

export type MemberMemory = { memberId: string; name: string; sbtCount: number }

/** RF-12: each in-person event mints one SBT per participant. */
export function sbtsByMember(events: readonly TerritorialEvent[]): readonly MemberMemory[] {
  const byMember = new Map<string, MemberMemory>()
  for (const event of events) {
    for (const participant of event.participants) {
      const current = byMember.get(participant.memberId) ?? { ...participant, sbtCount: 0 }
      byMember.set(participant.memberId, { ...current, sbtCount: current.sbtCount + 1 })
    }
  }
  return [...byMember.values()].sort((a, b) => b.sbtCount - a.sbtCount || a.name.localeCompare(b.name, 'pt-BR'))
}

export function totalParticipations(events: readonly TerritorialEvent[]): number {
  return events.reduce((sum, event) => sum + event.participants.length, 0)
}

export function collectiveMemoryCsv(events: readonly TerritorialEvent[]): string {
  const header = ['data', 'evento', 'tipo', 'localidade', 'organizador', 'latitude', 'longitude', 'participantes']
  const rows = [...events]
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
    .map((event) => [
      formatDate(event.occurredAt),
      event.name,
      event.activityType,
      event.locality,
      event.organizer,
      event.coordinates.lat.toFixed(5),
      event.coordinates.lng.toFixed(5),
      String(event.participants.length),
    ])
  return toCsv([header, ...rows])
}
