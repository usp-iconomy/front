import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NotFound from './not-found'

describe('NotFound', () => {
  it('explains the miss in Portuguese and links to both areas', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument()
    expect(screen.getByText('O endereço pode ter mudado ou não existir mais.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para os cursos' })).toHaveAttribute('href', '/courses')
    expect(screen.getByRole('link', { name: 'Ir para a administração' })).toHaveAttribute('href', '/admin')
  })
})
