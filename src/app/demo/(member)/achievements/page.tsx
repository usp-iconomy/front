import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { AchievementsScreen } from '@/screens/AchievementsScreen'

export const metadata: Metadata = { title: 'Meus Tokens Alma | Demonstração USP Iconomy' }

export default async function DemoAchievementsPage() {
  const soulTokens = await demoSource.listSoulTokens()
  if (soulTokens.status !== 'ok') throw new Error('demo source always answers')
  return <AchievementsScreen soulTokens={soulTokens.data} />
}
