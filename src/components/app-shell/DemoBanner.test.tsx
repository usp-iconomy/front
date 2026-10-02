import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DemoBanner } from './DemoBanner'

describe('DemoBanner', () => {
  it('offers only the way out of the demo, named for assistive tech', () => {
    render(<DemoBanner />)
    expect(screen.getByRole('note', { name: 'Modo demonstração' })).toHaveTextContent(/^Sair da demonstração$/)
    expect(screen.getByRole('link', { name: 'Sair da demonstração' })).toHaveAttribute('href', '/')
  })
})
