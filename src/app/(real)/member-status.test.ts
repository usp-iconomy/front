import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/data/api/client'
import { FORBIDDEN, guardApiRead, requireMemberStatus } from './member-status'

const mocks = vi.hoisted(() => ({
  getMemberStatus: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))
vi.mock('@/data/api/source', () => ({ getMemberStatus: mocks.getMemberStatus }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))

const apiError = (status: number) => new ApiError({ status, code: `http_${status}`, title: `HTTP ${status}`, detail: '' })

describe('requireMemberStatus', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns the member status the API gives', async () => {
    const status = { member: { id: 'u1' }, onboardingRequired: false }
    mocks.getMemberStatus.mockResolvedValue(status)

    await expect(requireMemberStatus()).resolves.toBe(status)
  })

  it('sends a session the API rejects to the entry page with the expiry notice', async () => {
    mocks.getMemberStatus.mockRejectedValue(apiError(401))

    await expect(requireMemberStatus()).rejects.toThrow('redirect:/?reason=session-expired')
  })

  it('answers FORBIDDEN, without a redirect, when the API refuses the account (403)', async () => {
    mocks.getMemberStatus.mockRejectedValue(apiError(403))

    await expect(requireMemberStatus()).resolves.toBe(FORBIDDEN)
    expect(mocks.redirect).not.toHaveBeenCalled()
  })

  it('lets any other API failure reach the error boundary', async () => {
    const failure = apiError(503)
    mocks.getMemberStatus.mockRejectedValue(failure)

    await expect(requireMemberStatus()).rejects.toBe(failure)
    expect(mocks.redirect).not.toHaveBeenCalled()
  })
})

describe('guardApiRead', () => {
  beforeEach(() => vi.clearAllMocks())

  it('passes a successful read through', async () => {
    await expect(guardApiRead(Promise.resolve('dados'))).resolves.toBe('dados')
  })

  it('maps 401 to the entry page and 403 to FORBIDDEN', async () => {
    await expect(guardApiRead(Promise.reject(apiError(401)))).rejects.toThrow('redirect:/?reason=session-expired')
    await expect(guardApiRead(Promise.reject(apiError(403)))).resolves.toBe(FORBIDDEN)
  })

  it('rethrows anything else', async () => {
    const failure = new Error('boom')
    await expect(guardApiRead(Promise.reject(failure))).rejects.toBe(failure)
  })
})
