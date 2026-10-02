import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { ImpactScreen } from '@/screens/ImpactScreen'

export const metadata: Metadata = { title: 'Dashboard de impacto — USP Iconomy' }

export default async function ImpactPage() {
  const impact = await demoSource.getImpact()
  if (impact.status !== 'ok') throw new Error('demo source always answers')
  return <ImpactScreen data={impact.data} />
}
