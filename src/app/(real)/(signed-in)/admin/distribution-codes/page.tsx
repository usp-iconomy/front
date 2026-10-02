import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Códigos de distribuição — Administração USP Iconomy' }

export default function AdminDistributionCodesPage() {
  return <UnderConstruction title="Códigos de distribuição" demoPath="/demo/admin/distribution-codes" />
}
