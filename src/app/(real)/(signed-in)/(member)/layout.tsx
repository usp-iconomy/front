import type { ReactNode } from 'react'
import { AppShell } from '@/components/app-shell/AppShell'
import { createApiSource } from '@/data/api/source'
import { adminEntryFor } from '@/lib/admin-access'

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const source = createApiSource()
  const [member, wallet, admin] = await Promise.all([source.getMember(), source.getWallet(), source.getAdmin()])
  if (member.status !== 'ok') throw new Error('the API source always answers getMember')
  const adminEntry = admin.status === 'ok' && admin.data ? adminEntryFor(admin.data.scope) : null

  return (
    <AppShell
      mode="real"
      member={member.data}
      wallet={wallet.status === 'ok' ? wallet.data : null}
      adminEntry={adminEntry}
    >
      {children}
    </AppShell>
  )
}
