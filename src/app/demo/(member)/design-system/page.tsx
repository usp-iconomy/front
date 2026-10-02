import type { Metadata } from 'next'
import { DesignSystemScreen } from '@/screens/DesignSystemScreen'

export const metadata: Metadata = { title: 'Design system | Demonstração USP Iconomy' }

export default function DemoDesignSystemPage() {
  return <DesignSystemScreen />
}
