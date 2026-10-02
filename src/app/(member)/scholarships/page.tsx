import type { Metadata } from 'next'
import { ScholarshipsScreen } from '@/screens/ScholarshipsScreen'

export const metadata: Metadata = { title: 'Bolsas e códigos de distribuição — USP Iconomy' }

export default function ScholarshipsPage() {
  return <ScholarshipsScreen />
}
