import type { Metadata } from 'next'
import { createApiSource } from '@/data/api/source'
import { CirculationScreen } from '@/screens/CirculationScreen'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Circulação — USP Iconomy' }

export default async function CirculationPage() {
  const feed = await createApiSource().listCirculation()
  if (feed.status !== 'ok') return <UnderConstruction title="Circulação" demoPath="/demo/circulation" />
  return <CirculationScreen feed={feed.data} />
}
