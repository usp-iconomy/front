import { describe, expect, it } from 'vitest'
import { EQUIVALENCE_TABLE, mockPaymentGateway, tierForAmount } from './donation'

describe('tierForAmount', () => {
  it('finds the exact tier for a known amount', () => {
    expect(tierForAmount(30)).toEqual({ amountReais: 30, tokens: 150, monthlyScholarships: 1 })
    expect(tierForAmount(300)).toEqual({ amountReais: 300, tokens: 1500, monthlyScholarships: 12 })
  })

  it('returns undefined for an amount outside the three tiers', () => {
    expect(tierForAmount(999)).toBeUndefined()
  })

  it('has three tiers, matching the table in the technical documentation', () => {
    expect(EQUIVALENCE_TABLE).toHaveLength(3)
  })
})

describe('mockPaymentGateway', () => {
  it('confirms both pix and boleto charges', async () => {
    await expect(mockPaymentGateway.charge(30, 'pix')).resolves.toEqual({ confirmed: true })
    await expect(mockPaymentGateway.charge(100, 'boleto')).resolves.toEqual({ confirmed: true })
  })
})
