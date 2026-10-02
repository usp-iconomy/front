import { render, screen } from '@testing-library/react'
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
vi.mock('@/auth/actions', () => ({ signOutAction: vi.fn() }))

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

  it('shows "Acesso restrito" instead of the screen when the API disables the account (403)', async () => {
    mocks.getMemberStatus.mockRejectedValue(new ApiError({ status: 403, code: 'forbidden', title: 'Forbidden', detail: '' }))

    render(await SignedInLayout({ children }))

    expect(screen.getByRole('heading', { level: 1, name: 'Acesso restrito' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(screen.queryByText('tela')).not.toBeInTheDocument()
    expect(mocks.redirect).not.toHaveBeenCalled()
  })
})
