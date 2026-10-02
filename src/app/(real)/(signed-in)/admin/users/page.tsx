import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Usuários e papéis | Administração USP Iconomy' }

export default function AdminUsersPage() {
  return <UnderConstruction title="Usuários e papéis" demoPath="/demo/admin/users" />
}
