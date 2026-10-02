import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
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
})
