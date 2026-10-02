import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { ImpactScreen } from '@/screens/ImpactScreen'

export const metadata: Metadata = { title: 'Dashboard de impacto | Demonstração USP Iconomy' }

export default async function DemoImpactPage() {
  const impact = await demoSource.getImpact()
  if (impact.status !== 'ok') throw new Error('demo source always answers')
  return <ImpactScreen data={impact.data} />
}
