import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OnboardingScreen, type OnboardingAction } from './OnboardingScreen'

describe('OnboardingScreen', () => {
  it('offers the three self-assignable profiles and no administration', () => {
    render(<OnboardingScreen action={vi.fn()} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Como você vai usar o USP Iconomy?' })).toBeInTheDocument()
    const options = screen.getAllByRole('radio')
    expect(options).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'Estudante' })).toHaveAccessibleDescription('Fazer cursos e circular tokens')
    expect(screen.getByRole('radio', { name: 'Docência' })).toHaveAccessibleDescription('Oferecer cursos à comunidade')
    expect(screen.getByRole('radio', { name: 'Doação' })).toHaveAccessibleDescription(
      'Financiar bolsas para quem não tem histórico',
    )
    expect(screen.queryByRole('radio', { name: /Administração/ })).not.toBeInTheDocument()
  })

  it('keeps "Continuar" disabled until a profile is picked', async () => {
    const user = userEvent.setup()
    render(<OnboardingScreen action={vi.fn()} />)

    const submit = screen.getByRole('button', { name: 'Continuar' })
    expect(submit).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Docência' }))
    expect(submit).toBeEnabled()
  })

  it('submits the picked role and shows the error the action returns', async () => {
    const user = userEvent.setup()
    const action = vi.fn<OnboardingAction>(async () => ({ error: 'role must be one of: student, teacher, donor' }))
    render(<OnboardingScreen action={action} />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    await user.click(screen.getByRole('radio', { name: 'Estudante' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(await screen.findByText('role must be one of: student, teacher, donor')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('role must be one of: student, teacher, donor')
    expect(action).toHaveBeenCalledTimes(1)
    expect(action.mock.calls[0]![1].get('role')).toBe('student')
  })
})
