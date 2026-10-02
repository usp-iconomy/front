import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ok } from '@/data/contracts'
import AdminLayout from './layout'

const mocks = vi.hoisted(() => ({ getAdmin: vi.fn() }))
vi.mock('@/data/api/source', () => ({ createApiSource: () => ({ getAdmin: mocks.getAdmin }) }))
vi.mock('next/navigation', () => ({ usePathname: () => '/admin' }))

async function renderLayout() {
  render(await AdminLayout({ children: <p>Conteúdo administrativo</p> }))
}

describe('real admin layout', () => {
  beforeEach(() => vi.clearAllMocks())

  it('turns a non-administrator away without the admin menu or the page', async () => {
    mocks.getAdmin.mockResolvedValue(ok(null))
    await renderLayout()

    expect(screen.getByRole('heading', { level: 1, name: 'Acesso restrito' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar para a plataforma' })).toHaveAttribute('href', '/courses')
    expect(screen.queryByRole('navigation', { name: 'Navegação administrativa' })).not.toBeInTheDocument()
    expect(screen.queryByText('Conteúdo administrativo')).not.toBeInTheDocument()
  })

  it('opens the admin shell for an administrator', async () => {
    mocks.getAdmin.mockResolvedValue(ok({ id: 'a1', name: 'Ana', email: 'ana@usp.br', scope: { kind: 'usp' } }))
    await renderLayout()

    expect(screen.getByRole('navigation', { name: 'Navegação administrativa' })).toBeInTheDocument()
    expect(screen.getByText('Conteúdo administrativo')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Acesso restrito' })).not.toBeInTheDocument()
  })
})
