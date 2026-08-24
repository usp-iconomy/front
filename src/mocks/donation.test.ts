import { describe, expect, it } from 'vitest'
import { donations, reportForDonation } from './donation'

describe('reportForDonation', () => {
  it('finds the report matching a donation id', () => {
    expect(reportForDonation('don-1')?.beneficiariesActive).toBe(12)
  })

  it('returns undefined for an unknown donation id', () => {
    expect(reportForDonation('does-not-exist')).toBeUndefined()
  })
})

describe('donations mock data', () => {
  it('gives every donation a matching report', () => {
    for (const donation of donations) {
      expect(reportForDonation(donation.id)).toBeDefined()
    }
  })
})
