import type { IconName } from '@/design-system'
import type { DistributionCode, DistributionCodeStatus } from '@/types/domain'
import { toCsv } from './csv'
import { formatDate } from './format'

/** RF-09: the redemption screen accepts exactly this many characters. */
export const CODE_LENGTH = 8

/** No 0/O or 1/I: partners read these codes aloud and over the phone. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateCode(taken: ReadonlySet<string>, random: () => number = Math.random): string {
  for (;;) {
    let code = ''
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      code += CODE_ALPHABET.charAt(Math.floor(random() * CODE_ALPHABET.length))
    }
    if (!taken.has(code)) return code
  }
}

export function codeStatus(code: DistributionCode, now: number): DistributionCodeStatus {
  if (now < Date.parse(code.validFrom)) return 'scheduled'
  if (now > Date.parse(code.validUntil)) return 'expired'
  if (code.redemptionsUsed >= code.maxRedemptions) return 'exhausted'
  return 'active'
}

export const codeStatusPresentation: Record<
  DistributionCodeStatus,
  { label: string; tone: 'positive' | 'neutral' | 'negative'; icon: IconName }
> = {
  scheduled: { label: 'Agendado', tone: 'neutral', icon: 'arrowRight' },
  active: { label: 'Ativo', tone: 'positive', icon: 'check' },
  exhausted: { label: 'Esgotado', tone: 'neutral', icon: 'ticket' },
  expired: { label: 'Expirado', tone: 'negative', icon: 'lock' },
}

const DATE_INPUT = /^(\d{4})-(\d{2})-(\d{2})$/

/** `YYYY-MM-DD` read as a calendar day in the admin's zone, as the UTC instant where that day starts or ends. */
export function localDayBoundaryUtc(dateInput: string, boundary: 'start' | 'end'): string | null {
  const match = DATE_INPUT.exec(dateInput)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date =
    boundary === 'start' ? new Date(year, month, day, 0, 0, 0, 0) : new Date(year, month, day, 23, 59, 59, 999)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
  return date.toISOString()
}

export type DistributionCodeDraft = {
  name: string
  tokensPerRedemption: string
  maxRedemptions: string
  /** `YYYY-MM-DD` from `<input type="date">`. */
  validFrom: string
  validUntil: string
  /** Empty string means no linked course. */
  courseId: string
}

export type DraftField = 'name' | 'tokensPerRedemption' | 'maxRedemptions' | 'validFrom' | 'validUntil'

export type NewDistributionCode = Omit<DistributionCode, 'code' | 'redemptionsUsed'>

export type DraftResult =
  | { ok: true; value: NewDistributionCode }
  | { ok: false; errors: Partial<Record<DraftField, string>> }

function parsePositiveInt(raw: string): number | null {
  const trimmed = raw.trim()
  if (!/^\d+$/.test(trimmed)) return null
  const value = Number(trimmed)
  return value > 0 && Number.isSafeInteger(value) ? value : null
}

export function validateDraft(draft: DistributionCodeDraft, now: number): DraftResult {
  const errors: Partial<Record<DraftField, string>> = {}

  const name = draft.name.trim()
  if (name.length === 0) errors.name = 'Dê um nome ao código, por exemplo o público ou o parceiro.'

  const tokensPerRedemption = parsePositiveInt(draft.tokensPerRedemption)
  if (tokensPerRedemption === null) errors.tokensPerRedemption = 'Use um número inteiro maior que zero.'

  const maxRedemptions = parsePositiveInt(draft.maxRedemptions)
  if (maxRedemptions === null) errors.maxRedemptions = 'Use um número inteiro maior que zero.'

  const validFrom = localDayBoundaryUtc(draft.validFrom, 'start')
  if (validFrom === null) errors.validFrom = 'Informe a data de início.'

  const validUntil = localDayBoundaryUtc(draft.validUntil, 'end')
  if (validUntil === null) errors.validUntil = 'Informe a data de fim.'
  else if (validFrom !== null && validUntil < validFrom) errors.validUntil = 'O fim não pode ser antes do início.'
  else if (Date.parse(validUntil) < now) errors.validUntil = 'Essa data já passou. Escolha um fim a partir de hoje.'

  if (
    tokensPerRedemption === null ||
    maxRedemptions === null ||
    validFrom === null ||
    validUntil === null ||
    Object.keys(errors).length > 0
  ) {
    return { ok: false, errors }
  }

  const value: NewDistributionCode = { name, tokensPerRedemption, maxRedemptions, validFrom, validUntil }
  if (draft.courseId !== '') value.courseId = draft.courseId
  return { ok: true, value }
}

export function distributionCodesCsv(
  codes: readonly DistributionCode[],
  now: number,
  courseTitle: (courseId: string) => string | undefined,
): string {
  const header = [
    'codigo',
    'nome',
    'tokens_por_resgate',
    'resgates_usados',
    'resgates_maximos',
    'valido_de',
    'valido_ate',
    'curso',
    'status',
  ]
  const rows = codes.map((code) => [
    code.code,
    code.name,
    String(code.tokensPerRedemption),
    String(code.redemptionsUsed),
    String(code.maxRedemptions),
    formatDate(code.validFrom),
    formatDate(code.validUntil),
    code.courseId ? (courseTitle(code.courseId) ?? code.courseId) : '',
    codeStatusPresentation[codeStatus(code, now)].label,
  ])
  return toCsv([header, ...rows])
}
