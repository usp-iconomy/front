import type { Metadata } from 'next'
import { DesignSystemScreen } from '@/screens/DesignSystemScreen'

export const metadata: Metadata = { title: 'Design system — USP Iconomy' }

export default function DesignSystemPage() {
  return <DesignSystemScreen />
}
