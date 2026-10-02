import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Menu, MenuItem, MenuSeparator } from './Menu'

function renderMenu() {
  render(
    <Menu trigger={<button type="button">Conta</button>} header={<p>Helena Prado</p>}>
      <MenuItem>
        <a href="/profile">Meu perfil</a>
      </MenuItem>
      <MenuSeparator />
      <MenuItem>
        <a href="/admin">Administração</a>
      </MenuItem>
    </Menu>,
  )
}

describe('Menu', () => {
  it('stays closed until the trigger is used', () => {
    renderMenu()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Conta' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens on click and exposes links as menu items', async () => {
    const user = userEvent.setup()
    renderMenu()

    await user.click(screen.getByRole('button', { name: 'Conta' }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Helena Prado')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Administração' })).toHaveAttribute('href', '/admin')
  })

  it('opens from the keyboard and closes on Escape, returning focus to the trigger', async () => {
    const user = userEvent.setup()
    renderMenu()

    screen.getByRole('button', { name: 'Conta' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Conta' })).toHaveFocus()
  })
})
