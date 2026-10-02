import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OnboardingScreen, type OnboardingAction, type OnboardingRole } from './OnboardingScreen'

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
    expect(screen.getByText('Fazer cursos e circular tokens').closest('[aria-hidden]')).toBeNull()
  })

  it('keeps "Continuar" enabled and explains an empty choice without calling the server', async () => {
    const user = userEvent.setup()
    const action = vi.fn<OnboardingAction>()
    render(<OnboardingScreen action={action} />)

    const submit = screen.getByRole('button', { name: 'Continuar' })
    expect(submit).toBeEnabled()
    await user.click(submit)

    expect(screen.getByRole('status')).toHaveTextContent('Escolha um perfil para continuar.')
    expect(action).not.toHaveBeenCalled()

    await user.click(screen.getByRole('radio', { name: 'Docência' }))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('shows the API error and keeps the picked profile checked for a retry', async () => {
    const user = userEvent.setup()
    const action = vi.fn<OnboardingAction>(async (_state, formData) => ({
      error: 'role must be one of: student, teacher, donor',
      role: formData.get('role') as OnboardingRole,
    }))
    render(<OnboardingScreen action={action} />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    await user.click(screen.getByRole('radio', { name: 'Estudante' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(await screen.findByText('role must be one of: student, teacher, donor')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('role must be one of: student, teacher, donor')
    expect(screen.getByRole('radio', { name: 'Estudante' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await waitFor(() => expect(action).toHaveBeenCalledTimes(2))
    expect(action.mock.calls.map(([, formData]) => formData.get('role'))).toEqual(['student', 'student'])
  })
})
