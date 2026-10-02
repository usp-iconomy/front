import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { ManagedUser } from '@/types/domain'
import { UserRoleManager } from './UserRoleManager'

function user(id: string, name: string, role: ManagedUser['role']): ManagedUser {
  return { id, name, email: `${id}@usp.br`, role, joinedAt: '2026-03-01T12:00:00Z', tokenBalance: 100, sent30d: 10 }
}

const users = [
  user('helena', 'Helena Prado', 'admin'),
  user('rafael', 'Rafael Lima', 'admin'),
  user('joao', 'João Santos', 'teacher'),
  user('ana', 'Ana Costa', 'student'),
]

describe('UserRoleManager', () => {
  it('finds a member by name without accents', async () => {
    const user = userEvent.setup()
    render(<UserRoleManager initialUsers={users} actorId="helena" />)

    await user.type(screen.getByRole('searchbox', { name: /buscar/i }), 'joao')

    expect(screen.getByText('João Santos')).toBeInTheDocument()
    expect(screen.queryByText('Ana Costa')).not.toBeInTheDocument()
  })

  it('changes a role and announces it', async () => {
    const user = userEvent.setup()
    render(<UserRoleManager initialUsers={users} actorId="helena" />)

    await user.selectOptions(screen.getByLabelText('Papel de Ana Costa'), 'teacher')

    expect(screen.getByText('Papel de Ana Costa alterado para Docência.')).toBeInTheDocument()
    expect(screen.getByLabelText('Papel de Ana Costa')).toHaveValue('teacher')
  })

  it('locks the admin out of changing their own role', () => {
    render(<UserRoleManager initialUsers={users} actorId="helena" />)
    expect(screen.getByLabelText('Papel de Helena Prado')).toBeDisabled()
  })
})
