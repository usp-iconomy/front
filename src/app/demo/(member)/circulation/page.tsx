import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { CirculationScreen } from '@/screens/CirculationScreen'

export const metadata: Metadata = { title: 'Circulação — Demonstração USP Iconomy' }

export default async function DemoCirculationPage() {
  const feed = await demoSource.listCirculation()
  if (feed.status !== 'ok') throw new Error('demo source always answers')
  return <CirculationScreen feed={feed.data} />
}
