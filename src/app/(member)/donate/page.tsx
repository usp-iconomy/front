import type { Metadata } from 'next'
import { DonateScreen } from '@/screens/DonateScreen'

export const metadata: Metadata = { title: 'Doar — USP Iconomy' }

export default function DonatePage() {
  return <DonateScreen />
}
