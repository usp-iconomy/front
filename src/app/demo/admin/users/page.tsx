import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { AdminUsersScreen } from '@/screens/AdminUsersScreen'

export const metadata: Metadata = { title: 'Usuários e papéis — Demonstração USP Iconomy' }

export default async function AdminUsersPage() {
  const [users, admin] = await Promise.all([demoSource.listManagedUsers(), demoSource.getAdmin()])
  if (users.status !== 'ok' || admin.status !== 'ok' || !admin.data) throw new Error('demo source always answers')
  return <AdminUsersScreen users={users.data} actorId={admin.data.id} />
}
