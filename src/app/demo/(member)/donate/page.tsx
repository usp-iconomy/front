import type { Metadata } from 'next'
import { DonateScreen } from '@/screens/DonateScreen'

export const metadata: Metadata = { title: 'Doar | Demonstração USP Iconomy' }

export default function DemoDonatePage() {
  return <DonateScreen />
}
