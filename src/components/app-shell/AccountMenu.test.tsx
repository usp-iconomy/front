import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AccountMenu } from './AccountMenu'

const toAdmin = {
  href: '/admin',
  label: 'Administração',
  description: 'Cursos, códigos, taxas e usuários',
  icon: 'shield',
} as const

describe('AccountMenu', () => {
  it('names the trigger after the account', () => {
    render(<AccountMenu name="Helena Prado" roleLabel="Administração USP" switchTo={toAdmin} />)
    expect(screen.getByRole('button', { name: 'Menu da conta: Helena Prado' })).toBeInTheDocument()
  })

  it('shows who is signed in and offers the other interface', async () => {
    const user = userEvent.setup()
    render(<AccountMenu name="Helena Prado" roleLabel="Administração USP" switchTo={toAdmin} />)

    await user.click(screen.getByRole('button', { name: 'Menu da conta: Helena Prado' }))

    expect(screen.getByText('Administração USP')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Administração/ })).toHaveAttribute('href', '/admin')
  })

  it('lists extra links before the switch', async () => {
    const user = userEvent.setup()
    render(
      <AccountMenu
        name="Helena Prado"
        roleLabel="Administração USP"
        links={[{ href: '/profile', label: 'Meu perfil', description: 'Saldo e Tokens Alma', icon: 'wallet' }]}
        switchTo={toAdmin}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Menu da conta: Helena Prado' }))

    const items = screen.getAllByRole('menuitem').map((item) => item.getAttribute('href'))
    expect(items).toEqual(['/profile', '/admin'])
  })

  it('offers no switch to someone without a second interface', async () => {
    const user = userEvent.setup()
    render(
      <AccountMenu
        name="Maria Joana"
        roleLabel="Estudante"
        links={[{ href: '/profile', label: 'Meu perfil', description: 'Saldo e Tokens Alma', icon: 'wallet' }]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Menu da conta: Maria Joana' }))

    expect(screen.queryByRole('menuitem', { name: /Administração/ })).not.toBeInTheDocument()
  })

  it('shows name and role in the trigger when asked to', () => {
    render(<AccountMenu name="Helena Prado" roleLabel="Administração USP" switchTo={toAdmin} showIdentity />)
    const trigger = screen.getByRole('button', { name: 'Menu da conta: Helena Prado' })
    expect(trigger).toHaveTextContent('Helena Prado')
    expect(trigger).toHaveTextContent('Administração USP')
  })

  it('ends the session from a last "Sair" item that is the submit button itself', async () => {
    const user = userEvent.setup()
    const signOut = vi.fn()
    render(<AccountMenu name="Maria Joana" roleLabel="Estudante" signOut={signOut} />)

    await user.click(screen.getByRole('button', { name: 'Menu da conta: Maria Joana' }))
    const item = screen.getByRole('menuitem', { name: 'Sair' })
    expect(item).toHaveAttribute('type', 'submit')
    expect(item.closest('form')).not.toBeNull()
    await user.click(item)

    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1))
  })

  it('leaves the demonstration through a link to the entry page', async () => {
    const user = userEvent.setup()
    render(<AccountMenu name="Maria Joana" roleLabel="Estudante" exitDemoHref="/" />)

    await user.click(screen.getByRole('button', { name: 'Menu da conta: Maria Joana' }))

    expect(screen.getByRole('menuitem', { name: 'Sair da demonstração' })).toHaveAttribute('href', '/')
  })

  it('offers no exit item when neither is given', async () => {
    const user = userEvent.setup()
    render(<AccountMenu name="Maria Joana" roleLabel="Estudante" />)

    await user.click(screen.getByRole('button', { name: 'Menu da conta: Maria Joana' }))

    expect(screen.queryByRole('menuitem', { name: /Sair/ })).not.toBeInTheDocument()
  })
})
