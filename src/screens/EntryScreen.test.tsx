import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EntryScreen, type EntryScreenProps } from './EntryScreen'

const actions = { signIn: vi.fn(), signUp: vi.fn(), signOut: vi.fn() }

function renderEntry(props: Partial<EntryScreenProps> = {}) {
  return render(<EntryScreen member={null} sessionExpired={false} next="/courses" actions={actions} {...props} />)
}

describe('EntryScreen', () => {
  it('names the product and its slogan', () => {
    renderEntry()
    expect(screen.getByRole('heading', { level: 1, name: 'USP Iconomy' })).toBeInTheDocument()
    expect(screen.getByText('Conhecimento que circula, transforma')).toBeInTheDocument()
  })

  describe('signed out', () => {
    it('offers Entrar, Criar conta and the demonstration', () => {
      renderEntry()

      expect(screen.getByRole('button', { name: 'Entrar' })).toHaveAttribute('type', 'submit')
      expect(screen.getByRole('button', { name: 'Criar conta' })).toHaveAttribute('type', 'submit')
      const demo = screen.getByRole('link', { name: 'Explorar demonstração' })
      expect(demo).toHaveAttribute('href', '/demo/courses')
      expect(demo).toHaveAccessibleDescription('Sem login. Todos os dados são fictícios.')
      expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /Continuar como/ })).not.toBeInTheDocument()
    })

    it('carries the destination to the sign-in form only', () => {
      renderEntry({ next: '/admin/users?tab=roles' })

      const signIn = screen.getByRole('button', { name: 'Entrar' }).closest('form')!
      expect(signIn.querySelector('input[name="next"]')).toHaveValue('/admin/users?tab=roles')
      const signUp = screen.getByRole('button', { name: 'Criar conta' }).closest('form')!
      expect(signUp).not.toBe(signIn)
      expect(signUp.querySelector('input[name="next"]')).toBeNull()
    })

    it('shows no notice by default', () => {
      renderEntry()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('announces an expired session above the sign-in', () => {
    renderEntry({ sessionExpired: true })
    expect(screen.getByRole('status')).toHaveTextContent('Sua sessão expirou. Entre de novo para continuar.')
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  describe('signed in', () => {
    it('continues as the member and offers Sair, keeping the demonstration', () => {
      renderEntry({ member: { name: 'Maria Joana' } })

      expect(screen.getByRole('link', { name: 'Continuar como Maria Joana' })).toHaveAttribute('href', '/courses')
      expect(within(screen.getByRole('button', { name: 'Sair' }).closest('form')!).getByRole('button')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Explorar demonstração' })).toHaveAttribute('href', '/demo/courses')
      expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Criar conta' })).not.toBeInTheDocument()
    })

    it('still counts someone without a name as signed in', () => {
      renderEntry({ member: { name: null } })

      expect(screen.getByRole('link', { name: 'Continuar' })).toHaveAttribute('href', '/courses')
      expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument()
    })
  })
})
