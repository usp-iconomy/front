import type { IconName } from '@/design-system'
import type { ActivityRecord, ImpactMetric } from '@/types/domain'

/** The icon is presentation, not domain data, so it is attached here. */
export type ImpactMetricView = ImpactMetric & { icon: IconName }

export const impactMetrics: readonly ImpactMetricView[] = [
  { id: 'participants', icon: 'users', label: 'Participantes ativos', value: '1.247', delta: '+12% este mês' },
  { id: 'circulating', icon: 'arrows', label: 'Tokens circulando', value: '48.500', delta: '+8,5% de fluxo' },
  { id: 'sbts', icon: 'doc', label: 'Tokens Alma emitidos', value: '3.892', delta: '+24% de crescimento' },
  { id: 'courses', icon: 'school', label: 'Cursos oferecidos', value: '42', delta: '+6 novos' },
  { id: 'communities', icon: 'globe', label: 'Comunidades beneficiadas', value: '18', delta: '+3 esta semana' },
  { id: 'sroi', icon: 'trendUp', label: 'SROI estimado', value: '4,2×', delta: 'por real investido' },
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
