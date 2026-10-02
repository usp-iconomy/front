import { describe, expect, it } from 'vitest'
import type { DataSource } from '../contracts'
import { demoSource } from './source'

type Method = Exclude<keyof DataSource, 'mode'>

// A Record keyed by the type makes a new DataSource method a compile error here.
const methods: Record<Method, true> = {
  getMember: true,
  getWallet: true,
  getAdmin: true,
  listCourses: true,
  listCirculation: true,
  listTransactions: true,
  listSoulTokens: true,
  getImpact: true,
  listDonations: true,
  getCommunityAnalysis: true,
  listCourseSubmissions: true,
  listDistributionCodes: true,
  getTokenRates: true,
  listManagedUsers: true,
  listCommunities: true,
}

describe('demoSource', () => {
  it('is the demo mode source', () => {
    expect(demoSource.mode).toBe('demo')
  })

  it.each(Object.keys(methods) as Method[])('%s resolves with data', async (method) => {
    const result = await demoSource[method]()
    expect(result.status).toBe('ok')
  })

  it('signs in Helena Prado as an administrator', async () => {
    const result = await demoSource.getMember()
    expect(result).toEqual({
      status: 'ok',
      data: {
        id: 'admin-usp-1',
        name: 'Helena Prado',
        email: 'helena.prado@usp.br',
        role: 'admin',
        isInstitutional: true,
      },
    })
  })

  it('scopes the demo administrator to USP', async () => {
    const result = await demoSource.getAdmin()
    expect(result.status === 'ok' && result.data?.scope).toEqual({ kind: 'usp' })
  })

  it('pairs each donation with its report', async () => {
    const result = await demoSource.listDonations()
    if (result.status !== 'ok') throw new Error('expected ok')
    expect(result.data.length).toBeGreaterThan(0)
    for (const { donation, report } of result.data) {
      expect(report?.donationId).toBe(donation.id)
    }
  })
})
