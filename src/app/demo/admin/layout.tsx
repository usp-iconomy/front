import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { demoSource } from '@/data/demo/source'

export const metadata: Metadata = { title: 'Administração (demonstração) — USP Iconomy' }

export default async function DemoAdminLayout({ children }: { children: ReactNode }) {
  const admin = await demoSource.getAdmin()
  if (admin.status !== 'ok' || !admin.data) throw new Error('demo source always answers')
  return <AdminShell admin={admin.data}>{children}</AdminShell>
}
