import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Taxas do token | Administração USP Iconomy' }

export default function AdminTokenSettingsPage() {
  return <UnderConstruction title="Taxas do token UAIFAI" demoPath="/demo/admin/token-settings" />
}
