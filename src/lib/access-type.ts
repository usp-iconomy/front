import type { Tone } from '@/design-system'
import type { AccessType } from '@/types/domain'

type AccessTypePresentation = {
  /** Short label, for badges. */
  label: string
  /** Full label, for filters and prose. */
  longLabel: string
  tone: Tone
}

/**
 * The single place where the domain's access types become Portuguese. Members
 * see "Token Alma"; the model says `sbt`, as the technical documentation does.
 */
export const accessTypePresentation: Record<AccessType, AccessTypePresentation> = {
  open: { label: 'Aberto', longLabel: 'Aberto', tone: 'open' },
  circulation: { label: 'Circulação', longLabel: 'Por circulação', tone: 'circulation' },
  distribution_code: { label: 'Código', longLabel: 'Código de distribuição', tone: 'code' },
  sbt: { label: 'Token Alma', longLabel: 'Por Token Alma', tone: 'sbt' },
}

export const accessTypes: readonly AccessType[] = ['open', 'circulation', 'distribution_code', 'sbt']
