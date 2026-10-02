import type { CommunityRateOverride, TokenRateSettings } from '@/types/domain'
import { formatNumber } from './format'

export function parseDecimal(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null
  return Number(normalized)
}

/** RF-07: increment = sent × (sent / balance), scaled by the configured multiplier. */
export function senderIncrement(sent: number, balance: number, multiplier: number): number {
  if (sent <= 0 || balance <= 0 || sent > balance) return 0
  return multiplier * sent * (sent / balance)
}

/** RN-05: compounding weekly decay never takes a balance below zero. */
export function projectDecay(balance: number, weeklyDecayPercent: number, weeks: number): number {
  return Math.max(0, balance * (1 - weeklyDecayPercent / 100) ** weeks)
}

const PERCENT_ERROR = 'Use um percentual entre 0 e 100.'

function parsePercent(raw: string): number | null {
  const value = parseDecimal(raw)
  return value === null || value > 100 ? null : value
}

export type RateErrors = Partial<Record<'incrementMultiplier' | 'weeklyDecayPercent', string>>

export type DefaultRatesResult = { ok: true; value: TokenRateSettings } | { ok: false; errors: RateErrors }

export function validateDefaultRates(
  raw: { incrementMultiplier: string; weeklyDecayPercent: string },
  overrides: readonly CommunityRateOverride[],
  communityName: (id: string) => string,
): DefaultRatesResult {
  const errors: RateErrors = {}

  const incrementMultiplier = parseDecimal(raw.incrementMultiplier)
  if (incrementMultiplier === null || incrementMultiplier <= 0) {
    errors.incrementMultiplier = 'Use um número maior que zero, como 1 ou 1,5.'
  }

  const weeklyDecayPercent = parsePercent(raw.weeklyDecayPercent)
  if (weeklyDecayPercent === null) {
    errors.weeklyDecayPercent = PERCENT_ERROR
  } else {
    const blocking = overrides.find((override) => override.weeklyDecayPercent >= weeklyDecayPercent)
    if (blocking) {
      errors.weeklyDecayPercent = `A taxa padrão precisa ficar acima da taxa de ${communityName(blocking.communityId)} (${formatNumber(blocking.weeklyDecayPercent)}%). Comunidades quilombolas sempre perdem menos que o padrão.`
    }
  }

  if (incrementMultiplier === null || weeklyDecayPercent === null || Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }
  return { ok: true, value: { incrementMultiplier, weeklyDecayPercent } }
}

export type OverrideResult = { ok: true; value: number } | { ok: false; error: string }

export function validateOverride(raw: string, defaultDecayPercent: number): OverrideResult {
  const value = parsePercent(raw)
  if (value === null) return { ok: false, error: PERCENT_ERROR }
  if (value >= defaultDecayPercent) {
    return {
      ok: false,
      error: `A taxa da comunidade precisa ser menor que a padrão (${formatNumber(defaultDecayPercent)}%). Escolha um valor abaixo dela.`,
    }
  }
  return { ok: true, value }
}
