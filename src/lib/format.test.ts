import { describe, expect, it } from 'vitest'
import { formatNumber } from './format'

describe('formatNumber', () => {
  it('formats with the pt-BR thousands separator', () => {
    expect(formatNumber(1500)).toBe('1.500')
  })
})
