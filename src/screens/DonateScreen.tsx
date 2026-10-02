import { PageHeader } from '@/design-system'
import { DonationFlow } from '@/components/donation/DonationFlow'

export function DonateScreen() {
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
