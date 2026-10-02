import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { DonationHistoryScreen } from '@/screens/DonationHistoryScreen'

export const metadata: Metadata = { title: 'Minhas doações — USP Iconomy' }

export default async function DonationHistoryPage() {
  const donations = await demoSource.listDonations()
  if (donations.status !== 'ok') throw new Error('demo source always answers')
  return <DonationHistoryScreen entries={donations.data} />
}
