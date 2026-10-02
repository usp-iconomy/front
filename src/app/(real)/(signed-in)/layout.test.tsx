import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/data/api/client'
import SignedInLayout from './layout'

const mocks = vi.hoisted(() => ({
  getMemberStatus: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))
vi.mock('@/data/api/source', () => ({ getMemberStatus: mocks.getMemberStatus }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))

const children = <p>tela</p>

describe('signed-in layout', () => {
  beforeEach(() => vi.clearAllMocks())

  it('keeps a member without a role on onboarding', async () => {
    mocks.getMemberStatus.mockResolvedValue({ member: { id: 'u1', role: null }, onboardingRequired: true })

    await expect(SignedInLayout({ children })).rejects.toThrow('redirect:/onboarding')
  })

  it('renders the screen once the role is chosen', async () => {
    mocks.getMemberStatus.mockResolvedValue({ member: { id: 'u1', role: 'student' }, onboardingRequired: false })

    await expect(SignedInLayout({ children })).resolves.toBe(children)
    expect(mocks.redirect).not.toHaveBeenCalled()
  })

  it('sends an expired session to the entry page', async () => {
    mocks.getMemberStatus.mockRejectedValue(
      new ApiError({ status: 401, code: 'unauthorized', title: 'Unauthorized', detail: '' }),
    )

    await expect(SignedInLayout({ children })).rejects.toThrow('redirect:/?reason=session-expired')
  })
})
