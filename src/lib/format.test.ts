import { describe, expect, it } from 'vitest'
import { formatDecimal, formatNumber } from './format'

describe('formatNumber', () => {
  it('formats with the pt-BR thousands separator', () => {
    expect(formatNumber(1500)).toBe('1.500')
  })
})

describe('formatDecimal', () => {
  it('shows two decimals with the pt-BR comma', () => {
    expect(formatDecimal(2.3095)).toBe('2,31')
    expect(formatDecimal(2)).toBe('2,00')
  })
})
