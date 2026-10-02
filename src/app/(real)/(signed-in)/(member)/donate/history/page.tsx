import type { Metadata } from 'next'
import { createApiSource } from '@/data/api/source'
import { DonationHistoryScreen } from '@/screens/DonationHistoryScreen'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Minhas doações — USP Iconomy' }

export default async function DonationHistoryPage() {
  const donations = await createApiSource().listDonations()
  if (donations.status !== 'ok') return <UnderConstruction title="Minhas doações" demoPath="/demo/donate/history" />
  return <DonationHistoryScreen entries={donations.data} />
}
