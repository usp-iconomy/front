import type { ManagedUser, UserRole } from '@/types/domain'

/** Function names, not person nouns, so each label fits anyone regardless of gender. */
export const roleLabel: Record<UserRole, string> = {
  student: 'Estudante',
  teacher: 'Docência',
  admin: 'Administração',
  donor: 'Doação',
}

export const userRoles: readonly UserRole[] = ['student', 'teacher', 'admin', 'donor']

export type RoleChangeError = 'unknown_user' | 'unchanged' | 'self_change' | 'last_admin'

export const roleChangeErrorMessage: Record<RoleChangeError, string> = {
  unknown_user: 'Usuário não encontrado.',
  unchanged: 'O usuário já tem esse papel.',
  self_change: 'Você não pode mudar o próprio papel. Peça para outra pessoa da administração.',
  last_admin: 'Esta é a última pessoa na administração. Dê esse papel a outra pessoa antes de mudar este.',
}

export function checkRoleChange(
  users: readonly ManagedUser[],
  actorId: string,
  targetId: string,
  nextRole: UserRole,
): RoleChangeError | null {
  const target = users.find((candidate) => candidate.id === targetId)
  if (!target) return 'unknown_user'
  if (target.role === nextRole) return 'unchanged'
  if (target.id === actorId) return 'self_change'
  if (target.role === 'admin' && users.filter((candidate) => candidate.role === 'admin').length === 1) {
    return 'last_admin'
  }
  return null
}

function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function filterUsers(
  users: readonly ManagedUser[],
  query: string,
  role: UserRole | 'all',
): readonly ManagedUser[] {
  const needle = fold(query.trim())
  return users.filter(
    (candidate) =>
      (role === 'all' || candidate.role === role) &&
      (needle === '' || fold(candidate.name).includes(needle) || fold(candidate.email).includes(needle)),
  )
}
