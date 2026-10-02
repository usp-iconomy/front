import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { ProfileScreen } from '@/screens/ProfileScreen'

export const metadata: Metadata = { title: 'Meu perfil e carteira — USP Iconomy' }

export default async function ProfilePage() {
  const [member, wallet, transactions] = await Promise.all([
    demoSource.getMember(),
    demoSource.getWallet(),
    demoSource.listTransactions(),
  ])
  if (member.status !== 'ok' || wallet.status !== 'ok' || transactions.status !== 'ok') {
    throw new Error('demo source always answers')
  }
  return <ProfileScreen member={member.data} wallet={wallet.data} transactions={transactions.data} />
}
