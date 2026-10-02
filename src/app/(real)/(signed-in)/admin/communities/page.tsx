import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Comunidades | Administração USP Iconomy' }

export default function AdminCommunitiesPage() {
  return <UnderConstruction title="Comunidades quilombolas" demoPath="/demo/admin/communities" />
}
