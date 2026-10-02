import type { ActivityRecord, ImpactMetric } from '@/types/domain'

export const impactMetrics: readonly ImpactMetric[] = [
  { id: 'participants', label: 'Participantes ativos', value: '1.247', delta: '+12% este mês' },
  { id: 'circulating', label: 'Tokens circulando', value: '48.500', delta: '+8,5% de fluxo' },
  { id: 'sbts', label: 'Tokens Alma emitidos', value: '3.892', delta: '+24% de crescimento' },
  { id: 'courses', label: 'Cursos oferecidos', value: '42', delta: '+6 novos' },
  { id: 'communities', label: 'Comunidades beneficiadas', value: '18', delta: '+3 esta semana' },
  { id: 'sroi', label: 'SROI estimado', value: '4,2×', delta: 'por real investido' },
]

export const activityRecords: readonly ActivityRecord[] = [
  {
    id: 'act-1',
    occurredAt: '2026-08-05T13:00:00Z',
    event: 'Circulação Quilombola',
    participants: 156,
    impact: 'Fortalecimento organizacional',
  },
  {
    id: 'act-2',
    occurredAt: '2026-08-01T13:00:00Z',
    event: 'Workshop Tecnologia & Descolonialidade',
    participants: 89,
    impact: 'Capacitação digital inclusiva',
  },
  {
    id: 'act-3',
    occurredAt: '2026-07-30T13:00:00Z',
    event: 'Token Alma — Liderança Feminista',
    participants: 34,
    impact: 'Empoderamento e rede',
  },
  {
    id: 'act-4',
    occurredAt: '2026-07-24T13:00:00Z',
    event: 'Distribuição de bolsas',
    participants: 23,
    impact: 'Acesso equitativo',
  },
]
