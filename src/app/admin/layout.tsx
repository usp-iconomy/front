import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { currentAdmin } from '@/mocks/admin'

export const metadata: Metadata = { title: 'Administração — USP Iconomy' }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell admin={currentAdmin}>{children}</AdminShell>
}
