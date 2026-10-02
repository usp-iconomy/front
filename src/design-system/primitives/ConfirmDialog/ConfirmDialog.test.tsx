import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

function renderConfirm() {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <ConfirmDialog
      open
      title="Alterar as taxas padrão?"
      confirmLabel="Alterar taxas"
      cancelLabel="Manter como está"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p>Antes e depois</p>
    </ConfirmDialog>,
  )
  return { onConfirm, onCancel }
}

describe('ConfirmDialog', () => {
  it('is named by its question and starts on the safe choice', () => {
    renderConfirm()
    expect(screen.getByRole('alertdialog', { name: 'Alterar as taxas padrão?' })).toHaveAccessibleDescription(
      'Antes e depois',
    )
    expect(screen.getByRole('button', { name: 'Manter como está' })).toHaveFocus()
  })

  it('confirms only from the confirm button', async () => {
    const user = userEvent.setup()
    const { onConfirm, onCancel } = renderConfirm()

    await user.click(screen.getByRole('button', { name: 'Alterar taxas' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('cancels on Escape', async () => {
    const user = userEvent.setup()
    const { onConfirm, onCancel } = renderConfirm()

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
