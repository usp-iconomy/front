import { PageHeader } from '@/design-system'
import { UserRoleManager } from '@/components/admin/UserRoleManager'
import type { ManagedUser } from '@/types/domain'

type AdminUsersScreenProps = { users: readonly ManagedUser[]; actorId: string }

export function AdminUsersScreen({ users, actorId }: AdminUsersScreenProps) {
  return (
    <>
      <PageHeader
        title="Usuários e papéis"
        description="Quem pode criar cursos, administrar a plataforma ou doar. Você não pode mudar o próprio papel, e a plataforma sempre mantém pelo menos uma pessoa na administração."
      />
      <UserRoleManager initialUsers={users} actorId={actorId} />
    </>
  )
}
