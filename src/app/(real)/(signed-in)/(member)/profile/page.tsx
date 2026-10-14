import type { Metadata } from 'next'
import { signOutAction } from '@/auth/actions'
import { createApiSource } from '@/data/api/source'
import { AccessRestrictedScreen } from '@/screens/AccessRestrictedScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { UnderConstruction } from '@/screens/UnderConstruction'
import { FORBIDDEN, guardApiRead } from '../../../member-status'

export const metadata: Metadata = { title: 'Meu perfil e carteira | USP Iconomy' }

export default async function ProfilePage() {
  const source = createApiSource()
  const results = await guardApiRead(
    Promise.all([source.getMember(), source.getWallet(), source.listTransactions()]),
  )
  if (results === FORBIDDEN) return <AccessRestrictedScreen signOut={signOutAction} />
  const [member, wallet, transactions] = results
  // Wallet is served by the API (Fase A). Transactions arrive with the
  // indexer in Fase B — show the balance anyway and leave the extract blank
  // until then.
  if (member.status !== 'ok' || wallet.status !== 'ok') {
    return <UnderConstruction title="Meu perfil e carteira" demoPath="/demo/profile" />
  }
  const extract = transactions.status === 'ok' ? transactions.data : []
  return <ProfileScreen member={member.data} wallet={wallet.data} transactions={extract} />
}
