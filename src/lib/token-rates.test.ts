import { describe, expect, it } from 'vitest'
import type { CommunityRateOverride } from '@/types/domain'
import { parseDecimal, projectDecay, senderIncrement, validateDefaultRates, validateOverride } from './token-rates'

const overrides: readonly CommunityRateOverride[] = [
  { communityId: 'kalunga', weeklyDecayPercent: 4 },
  { communityId: 'ivaporunduva', weeklyDecayPercent: 5 },
]
const names: Record<string, string> = { kalunga: 'Quilombo Kalunga', ivaporunduva: 'Quilombo Ivaporunduva' }
const communityName = (id: string) => names[id] ?? id

describe('parseDecimal', () => {
  it('accepts a pt-BR comma or a dot', () => {
    expect(parseDecimal('1,5')).toBe(1.5)
    expect(parseDecimal(' 2.25 ')).toBe(2.25)
  })

  it('rejects anything that is not a plain non-negative number', () => {
    expect(parseDecimal('')).toBeNull()
    expect(parseDecimal('-1')).toBeNull()
    expect(parseDecimal('1,2,3')).toBeNull()
    expect(parseDecimal('abc')).toBeNull()
  })
})

describe('senderIncrement', () => {
  it('applies the documented formula', () => {
    expect(senderIncrement(50, 200, 1)).toBe(12.5)
  })

  it('scales with the multiplier', () => {
    expect(senderIncrement(50, 200, 2)).toBe(25)
  })

  it('is zero for impossible transfers', () => {
    expect(senderIncrement(300, 200, 1)).toBe(0)
    expect(senderIncrement(10, 0, 1)).toBe(0)
  })
})

describe('projectDecay', () => {
  it('compounds weekly', () => {
    expect(projectDecay(100, 10, 4)).toBeCloseTo(65.61)
  })

  it('never goes below zero (RN-05)', () => {
    expect(projectDecay(100, 100, 3)).toBe(0)
  })
})

describe('validateDefaultRates', () => {
  it('accepts a default above every community rate', () => {
    expect(validateDefaultRates({ incrementMultiplier: '1', weeklyDecayPercent: '12' }, overrides, communityName)).toEqual({
      ok: true,
      value: { incrementMultiplier: 1, weeklyDecayPercent: 12 },
    })
  })

  it('refuses a default at or below a community rate (RN-07)', () => {
    const result = validateDefaultRates({ incrementMultiplier: '1', weeklyDecayPercent: '5' }, overrides, communityName)
    expect(!result.ok && result.errors.weeklyDecayPercent).toMatch(/Quilombo Ivaporunduva \(5%\)/)
  })

  it('refuses a zero multiplier and a decay above 100', () => {
    const result = validateDefaultRates({ incrementMultiplier: '0', weeklyDecayPercent: '120' }, overrides, communityName)
    expect(!result.ok && Object.keys(result.errors).sort()).toEqual(['incrementMultiplier', 'weeklyDecayPercent'])
  })
})

describe('validateOverride', () => {
  it('accepts a community rate below the default', () => {
    expect(validateOverride('3,5', 10)).toEqual({ ok: true, value: 3.5 })
  })

  it('refuses a community rate equal to the default (RN-07)', () => {
    const result = validateOverride('10', 10)
    expect(!result.ok && result.error).toMatch(/menor que a padrão/)
  })
})
