import { describe, expect, it } from 'vitest'
import type { ManagedUser } from '@/types/domain'
import { checkRoleChange, filterUsers } from './roles'

function user(id: string, name: string, role: ManagedUser['role']): ManagedUser {
  return {
    id,
    name,
    email: `${id}@usp.br`,
    role,
    joinedAt: '2026-03-01T12:00:00Z',
    tokenBalance: 100,
    sent30d: 10,
  }
}

const users = [
  user('helena', 'Helena Prado', 'admin'),
  user('rafael', 'Rafael Lima', 'admin'),
  user('joao', 'João Santos', 'teacher'),
  user('ana', 'Ana Costa', 'student'),
]

describe('checkRoleChange', () => {
  it('allows promoting a student to teacher', () => {
    expect(checkRoleChange(users, 'helena', 'ana', 'teacher')).toBeNull()
  })

  it('refuses changing your own role', () => {
    expect(checkRoleChange(users, 'helena', 'helena', 'teacher')).toBe('self_change')
  })

  it('refuses demoting the last admin', () => {
    const oneAdmin = users.filter((candidate) => candidate.id !== 'rafael')
    expect(checkRoleChange(oneAdmin, 'external-actor', 'helena', 'teacher')).toBe('last_admin')
  })

  it('reports a no-op and an unknown user', () => {
    expect(checkRoleChange(users, 'helena', 'ana', 'student')).toBe('unchanged')
    expect(checkRoleChange(users, 'helena', 'ghost', 'student')).toBe('unknown_user')
  })
})

describe('filterUsers', () => {
  it('matches names without accents', () => {
    expect(filterUsers(users, 'joao', 'all').map((candidate) => candidate.id)).toEqual(['joao'])
  })

  it('matches e-mail and combines with the role filter', () => {
    expect(filterUsers(users, 'usp.br', 'admin').map((candidate) => candidate.id)).toEqual(['helena', 'rafael'])
  })
})
