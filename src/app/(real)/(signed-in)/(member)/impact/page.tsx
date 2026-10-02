import type { Metadata } from 'next'
import { createApiSource } from '@/data/api/source'
import { ImpactScreen } from '@/screens/ImpactScreen'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Dashboard de impacto — USP Iconomy' }

export default async function ImpactPage() {
  const impact = await createApiSource().getImpact()
  if (impact.status !== 'ok') return <UnderConstruction title="Dashboard de impacto" demoPath="/demo/impact" />
  return <ImpactScreen data={impact.data} />
}
