import type { Metadata } from 'next'
import { createApiSource } from '@/data/api/source'
import { AchievementsScreen } from '@/screens/AchievementsScreen'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Meus Tokens Alma | USP Iconomy' }

export default async function AchievementsPage() {
  const soulTokens = await createApiSource().listSoulTokens()
  if (soulTokens.status !== 'ok') return <UnderConstruction title="Meus Tokens Alma" demoPath="/demo/achievements" />
  return <AchievementsScreen soulTokens={soulTokens.data} />
}
