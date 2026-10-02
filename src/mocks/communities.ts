import type { QuilombolaCommunity, TerritorialEvent } from '@/types/domain'

export const quilombolaCommunities: readonly QuilombolaCommunity[] = [
  { id: 'kalunga', name: 'Quilombo Kalunga', territory: 'Cavalcante, GO', members: 184, dataSharingConsent: false },
  {
    id: 'ivaporunduva',
    name: 'Quilombo Ivaporunduva',
    territory: 'Eldorado, SP',
    members: 96,
    dataSharingConsent: true,
  },
]

export const territorialEvents: readonly TerritorialEvent[] = [
  {
    id: 'klg-assembleia-2026-08',
    communityId: 'kalunga',
    name: 'Assembleia de agosto',
    activityType: 'Assembleia',
    occurredAt: '2026-08-16T13:00:00Z',
    organizer: 'Benedita Souza',
    locality: 'Engenho II',
    coordinates: { lat: -13.7963, lng: -47.4581 },
    participants: [
      { memberId: 'klg-ana', name: 'Ana Francisca' },
      { memberId: 'klg-rosa', name: 'Rosa Maria' },
      { memberId: 'klg-zeca', name: 'José Cirilo' },
    ],
  },
  {
    id: 'klg-oficina-2026-09',
    communityId: 'kalunga',
    name: 'Oficina de sementes crioulas',
    activityType: 'Oficina',
    occurredAt: '2026-09-12T12:30:00Z',
    organizer: 'Rosa Maria',
    locality: 'Vão de Almas',
    coordinates: { lat: -13.5402, lng: -47.0718 },
    participants: [
      { memberId: 'klg-ana', name: 'Ana Francisca' },
      { memberId: 'klg-rosa', name: 'Rosa Maria' },
    ],
  },
  {
    id: 'klg-cultura-2026-09',
    communityId: 'kalunga',
    name: 'Roda de sussa',
    activityType: 'Atividade cultural',
    occurredAt: '2026-09-27T21:00:00Z',
    organizer: 'José Cirilo',
    locality: 'Engenho II',
    coordinates: { lat: -13.7959, lng: -47.4576 },
    participants: [
      { memberId: 'klg-ana', name: 'Ana Francisca' },
      { memberId: 'klg-zeca', name: 'José Cirilo' },
    ],
  },
  {
    id: 'ivp-oficina-2026-09',
    communityId: 'ivaporunduva',
    name: 'Oficina de artesanato em palha',
    activityType: 'Oficina',
    occurredAt: '2026-09-06T14:00:00Z',
    organizer: 'Antônia Pedroso',
    locality: 'Centro comunitário',
    coordinates: { lat: -24.5672, lng: -48.3811 },
    participants: [
      { memberId: 'ivp-antonia', name: 'Antônia Pedroso' },
      { memberId: 'ivp-benedito', name: 'Benedito Rosa' },
    ],
  },
  {
    id: 'ivp-assembleia-2026-09',
    communityId: 'ivaporunduva',
    name: 'Assembleia da associação',
    activityType: 'Assembleia',
    occurredAt: '2026-09-21T13:00:00Z',
    organizer: 'Benedito Rosa',
    locality: 'Margem do Ribeira',
    coordinates: { lat: -24.5701, lng: -48.3854 },
    participants: [
      { memberId: 'ivp-antonia', name: 'Antônia Pedroso' },
      { memberId: 'ivp-benedito', name: 'Benedito Rosa' },
      { memberId: 'ivp-cida', name: 'Aparecida Furquim' },
    ],
  },
]
