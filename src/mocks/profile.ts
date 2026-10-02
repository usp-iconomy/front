import type { Member, SoulToken, Transaction, WalletSummary } from '@/types/domain'

/** Same person as currentAdmin in mocks/admin.ts: one session, two interfaces. */
export const demoMember: Member = {
  id: 'admin-usp-1',
  name: 'Helena Prado',
  email: 'helena.prado@usp.br',
  role: 'admin',
  isInstitutional: true,
}

export const demoWallet: WalletSummary = {
  tokenBalance: 450,
  circulationCount: 18,
  soulTokenCount: 3,
  reputationStars: 5,
  reputationLabel: 'Muito ativo',
}

export const transactions: readonly Transaction[] = [
  {
    id: 'tx-1',
    kind: 'sent',
    description: 'Para João Santos — apoio à mentoria',
    amount: 50,
    occurredAt: '2026-08-05T14:30:00Z',
    status: 'completed',
  },
  {
    id: 'tx-2',
    kind: 'received',
    description: 'De Coletivo Malê — facilitação de oficina',
    amount: 100,
    occurredAt: '2026-08-03T11:10:00Z',
    status: 'completed',
  },
  {
    id: 'tx-3',
    kind: 'sbt_issued',
    description: 'Liderança Feminista',
    amount: null,
    occurredAt: '2026-07-30T18:00:00Z',
    status: 'issued',
  },
  {
    id: 'tx-4',
    kind: 'received',
    description: 'Da Rede Quilombola — pesquisa colaborativa',
    amount: 75,
    occurredAt: '2026-07-27T09:45:00Z',
    status: 'completed',
  },
]

export const soulTokens: readonly SoulToken[] = [
  {
    id: 'sbt-1',
    courseTitle: 'Economia Simbólica 101',
    issuedAt: '2026-03-18T12:00:00Z',
    transferable: false,
  },
  {
    id: 'sbt-2',
    courseTitle: 'Design Comunitário',
    issuedAt: '2026-05-22T12:00:00Z',
    transferable: false,
    place: 'Quilombo Kalunga, GO',
  },
  {
    id: 'sbt-3',
    courseTitle: 'Liderança Feminista',
    issuedAt: '2026-07-30T12:00:00Z',
    transferable: false,
  },
]
