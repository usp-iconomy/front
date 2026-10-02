import type { Metadata } from 'next'
import { createApiSource } from '@/data/api/source'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Meu perfil e carteira — USP Iconomy' }

export default async function ProfilePage() {
  const source = createApiSource()
  const [member, wallet, transactions] = await Promise.all([
    source.getMember(),
    source.getWallet(),
    source.listTransactions(),
  ])
  if (member.status !== 'ok' || wallet.status !== 'ok' || transactions.status !== 'ok') {
    return <UnderConstruction title="Meu perfil e carteira" demoPath="/demo/profile" />
  }
  return <ProfileScreen member={member.data} wallet={wallet.data} transactions={transactions.data} />
}
