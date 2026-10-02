import type { Metadata } from 'next'
import { ScholarshipsScreen } from '@/screens/ScholarshipsScreen'

export const metadata: Metadata = { title: 'Bolsas e códigos de distribuição | Demonstração USP Iconomy' }

export default function DemoScholarshipsPage() {
  return <ScholarshipsScreen />
}
