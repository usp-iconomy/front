import type { Metadata } from 'next'
import { PageHeader } from '@/design-system'
import { DonationFlow } from '@/components/donation/DonationFlow'

export const metadata: Metadata = { title: 'Doar — USP Iconomy' }

export default function DonatePage() {
  return (
    <>
      <PageHeader
        title="Doar para a comunidade"
        description="Sua doação em reais vira tokens UAIFAI e bolsas de acesso para quem ainda não tem histórico de circulação."
      />
      <DonationFlow />
    </>
  )
}
