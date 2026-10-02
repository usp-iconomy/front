import type { DistributionCode } from '@/types/domain'

export const distributionCodes: readonly DistributionCode[] = [
  {
    code: 'KLG7M2Q9',
    name: 'Quilombo Kalunga, turma 1',
    tokensPerRedemption: 200,
    maxRedemptions: 40,
    redemptionsUsed: 31,
    validFrom: '2026-09-01T03:00:00.000Z',
    validUntil: '2027-01-01T02:59:59.999Z',
    courseId: 'design-comunitario',
  },
  {
    code: 'PRF4X8N3',
    name: 'Periferia Leste, Jardim Helena',
    tokensPerRedemption: 150,
    maxRedemptions: 60,
    redemptionsUsed: 60,
    validFrom: '2026-08-15T03:00:00.000Z',
    validUntil: '2026-12-01T02:59:59.999Z',
  },
  {
    code: 'EST2H6W5',
    name: 'Coletivo estudantil FFLCH',
    tokensPerRedemption: 100,
    maxRedemptions: 30,
    redemptionsUsed: 12,
    validFrom: '2026-06-01T03:00:00.000Z',
    validUntil: '2026-09-01T02:59:59.999Z',
    courseId: 'tecnologia-e-descolonialidade',
  },
  {
    code: 'IVP9T3K7',
    name: 'Quilombo Ivaporunduva, oficina de novembro',
    tokensPerRedemption: 200,
    maxRedemptions: 25,
    redemptionsUsed: 0,
    validFrom: '2026-11-01T03:00:00.000Z',
    validUntil: '2027-02-01T02:59:59.999Z',
  },
]
