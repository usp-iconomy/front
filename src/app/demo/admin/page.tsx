import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { AdminOverviewScreen } from '@/screens/AdminOverviewScreen'

export const metadata: Metadata = { title: 'Visão geral — Demonstração USP Iconomy' }

export default async function AdminOverviewPage() {
  const analysis = await demoSource.getCommunityAnalysis()
  if (analysis.status !== 'ok') throw new Error('demo source always answers')
  return <AdminOverviewScreen analysis={analysis.data} />
}
