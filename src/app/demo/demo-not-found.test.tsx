import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DemoIndexPage from './page'
import DemoMissingPage from './[...missing]/page'
import DemoNotFound from './not-found'

const navigation = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
  notFound: vi.fn(() => {
    throw new Error('not-found')
  }),
}))
vi.mock('next/navigation', () => navigation)

describe('demo entry and misses', () => {
  it('sends /demo to the demo courses', () => {
    expect(() => DemoIndexPage()).toThrow('redirect:/demo/courses')
  })

  it('answers an unknown demo path with the demo 404', () => {
    expect(() => DemoMissingPage()).toThrow('not-found')
  })

  it('explains the miss and links only inside the demo', () => {
    const { container } = render(<DemoNotFound />)

    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument()
    expect(screen.getByText('O endereço pode ter mudado ou não existir mais.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para os cursos' })).toHaveAttribute('href', '/demo/courses')
    expect(screen.getByRole('link', { name: 'Ir para a administração' })).toHaveAttribute('href', '/demo/admin')
    const hrefs = [...container.querySelectorAll('a')].map((link) => link.getAttribute('href'))
    expect(hrefs.filter((href) => !href?.startsWith('/demo/'))).toEqual([])
  })
})
