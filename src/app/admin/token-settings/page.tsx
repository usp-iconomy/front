import type { Metadata } from 'next'
import { PageHeader } from '@/design-system'
import { TokenSettingsPanel } from '@/components/admin/TokenSettingsPanel'
import { currentAdmin } from '@/mocks/admin'
import { quilombolaCommunities } from '@/mocks/communities'
import { communityRateOverrides, tokenRateSettings } from '@/mocks/token-settings'

export const metadata: Metadata = { title: 'Taxas do token — Administração USP Iconomy' }

export default function AdminTokenSettingsPage() {
  return (
    <>
      <PageHeader
        title="Taxas do token UAIFAI"
        description="Quanto quem envia ganha de volta e quanto um saldo parado perde por semana. Toda mudança passa por uma revisão antes de valer."
      />
      <TokenSettingsPanel
        scope={currentAdmin.scope}
        initialSettings={tokenRateSettings}
        initialOverrides={communityRateOverrides}
        communities={quilombolaCommunities.map(({ id, name }) => ({ id, name }))}
      />
    </>
  )
}
