import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Member, WalletSummary } from '@/types/domain'
import { SiteHeader } from './SiteHeader'

const navigation = vi.hoisted(() => ({ pathname: '/courses' }))
vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))
vi.mock('@/auth/actions', () => ({ signOutAction: vi.fn() }))

const member: Member = {
  id: 'm1',
  name: 'Maria Joana',
  email: 'maria.joana@usp.br',
  role: 'student',
  isInstitutional: true,
}
const wallet: WalletSummary = {
  tokenBalance: 450,
  circulationCount: 18,
  soulTokenCount: 3,
  reputationStars: 5,
  reputationLabel: 'Muito ativo',
}
const adminEntry = { href: '/admin', scopeLabel: 'Administração USP', description: 'Cursos, códigos, taxas e usuários' }

describe('SiteHeader', () => {
  it('hides the balance when the wallet has no data', () => {
    navigation.pathname = '/courses'
    const { rerender } = render(<SiteHeader mode="real" member={member} wallet={wallet} adminEntry={null} />)
    expect(screen.getByText(/450/)).toBeInTheDocument()

    rerender(<SiteHeader mode="real" member={member} wallet={null} adminEntry={null} />)
    expect(screen.queryByText(/450/)).not.toBeInTheDocument()
  })

  it('names the role when there is no admin entry', async () => {
    navigation.pathname = '/courses'
    const user = userEvent.setup()
    render(<SiteHeader mode="real" member={member} wallet={wallet} adminEntry={null} />)

    await user.click(screen.getByRole('button', { name: 'Menu da conta: Maria Joana' }))

    expect(screen.getByText('Estudante')).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: /Administração/ })).not.toBeInTheDocument()
  })

  it('keeps real links in the real tree', async () => {
    navigation.pathname = '/courses'
    const user = userEvent.setup()
    render(<SiteHeader mode="real" member={member} wallet={wallet} adminEntry={adminEntry} />)

    expect(screen.getByRole('link', { name: 'USP Iconomy' })).toHaveAttribute('href', '/courses')
    expect(screen.getByRole('link', { name: 'Cursos' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: 'Menu da conta: Maria Joana' }))
    const items = screen.getAllByRole('menuitem').map((item) => item.getAttribute('href'))
    expect(items).toEqual(['/profile', '/admin', null])
    expect(screen.getAllByRole('menuitem').at(-1)).toHaveTextContent('Sair')
  })

  it('keeps demo links in the demo tree and marks the current page', async () => {
    navigation.pathname = '/demo/profile'
    const user = userEvent.setup()
    render(<SiteHeader mode="demo" member={member} wallet={wallet} adminEntry={adminEntry} />)

    expect(screen.getByRole('link', { name: 'USP Iconomy' })).toHaveAttribute('href', '/demo/courses')
    const profile = screen.getByRole('link', { name: 'Perfil' })
    expect(profile).toHaveAttribute('href', '/demo/profile')
    expect(profile).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: 'Menu da conta: Maria Joana' }))
    const items = screen.getAllByRole('menuitem').map((item) => item.getAttribute('href'))
    expect(items).toEqual(['/demo/profile', '/demo/admin', '/'])
    expect(screen.getByRole('menuitem', { name: 'Sair da demonstração' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('menuitem', { name: 'Sair' })).not.toBeInTheDocument()
  })
})
