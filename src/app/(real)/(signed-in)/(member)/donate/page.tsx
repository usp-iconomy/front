import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Doar | USP Iconomy' }

// Unconditional: the screen's payment flow runs on mocks and would look like a real donation.
export default function DonatePage() {
  return <UnderConstruction title="Doar para a comunidade" demoPath="/demo/donate" />
}
