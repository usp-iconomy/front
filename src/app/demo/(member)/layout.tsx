import type { ReactNode } from 'react'
import { AppShell } from '@/components/app-shell/AppShell'
import { demoSource } from '@/data/demo/source'
import { adminEntryFor } from '@/lib/admin-access'

export default async function DemoMemberLayout({ children }: { children: ReactNode }) {
  const [member, wallet, admin] = await Promise.all([
    demoSource.getMember(),
    demoSource.getWallet(),
    demoSource.getAdmin(),
  ])
  if (member.status !== 'ok' || wallet.status !== 'ok' || admin.status !== 'ok') {
    throw new Error('demo source always answers')
  }
  const adminEntry = admin.data ? adminEntryFor(admin.data.scope) : null

  return (
    <AppShell mode="demo" member={member.data} wallet={wallet.data} adminEntry={adminEntry}>
      {children}
    </AppShell>
  )
}
