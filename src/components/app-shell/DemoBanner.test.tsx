import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DemoBanner } from './DemoBanner'

describe('DemoBanner', () => {
  it('says the data is fictitious and leads back to the entry page', () => {
    render(<DemoBanner />)
    expect(screen.getByRole('note')).toHaveTextContent('Demonstração · dados fictícios')
    expect(screen.getByRole('link', { name: 'Sair da demonstração' })).toHaveAttribute('href', '/')
  })
})
