import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Visão geral | Administração USP Iconomy' }

export default function AdminOverviewPage() {
  return <UnderConstruction title="Visão geral da comunidade" demoPath="/demo/admin" />
}
