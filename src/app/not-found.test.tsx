import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NotFound from './not-found'

const navigation = vi.hoisted(() => ({ pathname: '/unknown' }))
vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))

describe('NotFound', () => {
  beforeEach(() => {
    navigation.pathname = '/unknown'
  })

  it('explains the miss in Portuguese and links to both areas', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument()
    expect(screen.getByText('O endereço pode ter mudado ou não existir mais.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para os cursos' })).toHaveAttribute('href', '/courses')
    expect(screen.getByRole('link', { name: 'Ir para a administração' })).toHaveAttribute('href', '/admin')
  })

  it('keeps a demo visitor inside the demo', () => {
    navigation.pathname = '/demo/admin/unknown'
    render(<NotFound />)
    expect(screen.getByRole('link', { name: 'Ir para os cursos' })).toHaveAttribute('href', '/demo/courses')
    expect(screen.getByRole('link', { name: 'Ir para a administração' })).toHaveAttribute('href', '/demo/admin')
  })
})
