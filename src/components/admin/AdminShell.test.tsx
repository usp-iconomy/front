import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AdminUser } from '@/types/domain'
import { AdminShell } from './AdminShell'

const navigation = vi.hoisted(() => ({ pathname: '/admin' }))
vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))

const usp: AdminUser = { id: 'a1', name: 'Helena Prado', email: 'helena.prado@usp.br', scope: { kind: 'usp' } }
const kalunga: AdminUser = {
  id: 'a2',
  name: 'Benedita Souza',
  email: 'benedita.souza@kalunga.org.br',
  scope: { kind: 'quilombola', communityId: 'kalunga' },
}

describe('AdminShell', () => {
  beforeEach(() => {
    navigation.pathname = '/admin'
  })

  it('renders the page for a section the admin can open', () => {
    navigation.pathname = '/admin/users'
    render(
      <AdminShell admin={usp}>
        <p>conteúdo da página</p>
      </AdminShell>,
    )
    expect(screen.getByText('conteúdo da página')).toBeInTheDocument()
  })

  it('replaces the page with a restricted notice outside the admin scope', () => {
    navigation.pathname = '/admin/users'
    render(
      <AdminShell admin={kalunga}>
        <p>conteúdo da página</p>
      </AdminShell>,
    )
    expect(screen.queryByText('conteúdo da página')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /acesso restrito/i })).toBeInTheDocument()
  })

  it('lets unknown admin paths fall through to the 404 page', () => {
    navigation.pathname = '/admin/unknown'
    render(
      <AdminShell admin={kalunga}>
        <p>página não encontrada</p>
      </AdminShell>,
    )
    expect(screen.getByText('página não encontrada')).toBeInTheDocument()
  })

  it('marks the current section in the navigation', () => {
    navigation.pathname = '/admin/distribution-codes'
    render(<AdminShell admin={usp}>{null}</AdminShell>)
    expect(screen.getByRole('link', { name: /códigos de distribuição/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /visão geral/i })).not.toHaveAttribute('aria-current')
  })

  it('keeps a nested community page marked under its section', () => {
    navigation.pathname = '/admin/communities/kalunga'
    render(<AdminShell admin={usp}>{null}</AdminShell>)
    expect(screen.getByRole('link', { name: /^comunidades$/i })).toHaveAttribute('aria-current', 'page')
  })

  it('hides USP-only sections from a quilombola admin', () => {
    navigation.pathname = '/admin/communities/kalunga'
    render(<AdminShell admin={kalunga}>{null}</AdminShell>)
    expect(screen.queryByRole('link', { name: /usuários e papéis/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /minha comunidade/i })).toBeInTheDocument()
  })

  it('switches to the platform from the account menu', async () => {
    const user = userEvent.setup()
    render(<AdminShell admin={usp}>{null}</AdminShell>)

    expect(screen.queryByRole('link', { name: /voltar ao site/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Menu da conta: Helena Prado' }))

    expect(screen.getByRole('menuitem', { name: /Plataforma/ })).toHaveAttribute('href', '/courses')
  })
})
