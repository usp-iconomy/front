import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Bolsas e códigos de distribuição | USP Iconomy' }

// Unconditional: the screen's redemption flow runs on mocks and would look like a real credit.
export default function ScholarshipsPage() {
  return <UnderConstruction title="Bolsas e códigos de distribuição" demoPath="/demo/scholarships" />
}
