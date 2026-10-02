import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { AccessDenied } from '@/components/admin/AccessDenied'
import { AdminShell } from '@/components/admin/AdminShell'
import { createApiSource } from '@/data/api/source'
import styles from './layout.module.css'

export const metadata: Metadata = { title: 'Administração — USP Iconomy' }

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await createApiSource().getAdmin()
  if (admin.status !== 'ok') throw new Error('the API source always answers getAdmin')

  if (!admin.data) {
    return (
      <main className={styles.denied}>
        <AccessDenied description="Esta área é só para quem administra a plataforma." />
        <Link href="/courses" className={styles.back}>
          Voltar para a plataforma
        </Link>
      </main>
    )
  }
  return <AdminShell admin={admin.data}>{children}</AdminShell>
}
