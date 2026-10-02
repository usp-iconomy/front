import type { Metadata } from 'next'
import { PageHeader } from '@/design-system'
import { UserRoleManager } from '@/components/admin/UserRoleManager'
import { currentAdmin } from '@/mocks/admin'
import { managedUsers } from '@/mocks/admin-users'

export const metadata: Metadata = { title: 'Usuários e papéis — Administração USP Iconomy' }

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Usuários e papéis"
        description="Quem pode criar cursos, administrar a plataforma ou doar. Você não pode mudar o próprio papel, e a plataforma sempre mantém pelo menos uma pessoa na administração."
      />
      <UserRoleManager initialUsers={managedUsers} actorId={currentAdmin.id} />
    </>
  )
}
