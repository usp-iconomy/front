import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/data/api/client'
import { requireMemberStatus } from './member-status'

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

  it('lets any other API failure reach the error boundary', async () => {
    const failure = apiError(503)
    mocks.getMemberStatus.mockRejectedValue(failure)

    await expect(requireMemberStatus()).rejects.toBe(failure)
    expect(mocks.redirect).not.toHaveBeenCalled()
  })
})
