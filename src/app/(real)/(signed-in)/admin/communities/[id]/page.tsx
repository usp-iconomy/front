import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Comunidade — Administração USP Iconomy' }

// Real community ids mean nothing in the demo, so the link goes to the demo's list.
export default function AdminCommunityPage() {
  return <UnderConstruction title="Comunidade" demoPath="/demo/admin/communities" />
}
