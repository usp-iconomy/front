import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccessRestrictedScreen } from './AccessRestrictedScreen'

describe('AccessRestrictedScreen', () => {
  it('says the account is disabled or lacks permission, and offers Sair and the entry page', () => {
    const signOut = vi.fn()
    render(<AccessRestrictedScreen signOut={signOut} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Acesso restrito' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Sua conta está desativada ou sem permissão para esta área. Fale com a administração do USP Iconomy.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toHaveAttribute('type', 'submit')
    expect(screen.getByRole('link', { name: 'Voltar para o início' })).toHaveAttribute('href', '/')
  })
})
