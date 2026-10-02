import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/data/api/client'
import MemberLayout from './(signed-in)/(member)/layout'
import ProfilePage from './(signed-in)/(member)/profile/page'
import OnboardingPage from './onboarding/page'

const forbidden = () => new ApiError({ status: 403, code: 'forbidden', title: 'Forbidden', detail: 'This account has been disabled.' })

const mocks = vi.hoisted(() => ({
  getMemberStatus: vi.fn(),
  getMember: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))
vi.mock('@/data/api/source', () => ({
  getMemberStatus: mocks.getMemberStatus,
  createApiSource: () => ({
    getMember: mocks.getMember,
    getAdmin: mocks.getMember,
    getWallet: async () => ({ status: 'unavailable' }),
    listTransactions: async () => ({ status: 'unavailable' }),
  }),
}))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect, usePathname: () => '/profile' }))
vi.mock('@/auth/actions', () => ({ signOutAction: vi.fn() }))
vi.mock('./onboarding/actions', () => ({ chooseRoleAction: vi.fn() }))

const routes: [string, () => Promise<ReactElement>][] = [
  ['the member layout', () => MemberLayout({ children: <p>tela</p> })],
  ['the profile page', () => ProfilePage()],
  ['the onboarding page', () => OnboardingPage()],
]

describe.each(routes)('a disabled account (403) on %s', (_label, renderRoute) => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getMemberStatus.mockRejectedValue(forbidden())
    mocks.getMember.mockRejectedValue(forbidden())
  })

  it('sees "Acesso restrito" with Sair, not the error boundary', async () => {
    render(await renderRoute())

    expect(screen.getByRole('heading', { level: 1, name: 'Acesso restrito' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(screen.queryByText('tela')).not.toBeInTheDocument()
    expect(mocks.redirect).not.toHaveBeenCalled()
  })
})
