import { PageHeader } from '@/design-system'
import { TokenSettingsPanel } from '@/components/admin/TokenSettingsPanel'
import type { TokenRatesData } from '@/data/contracts'
import type { AdminScope, QuilombolaCommunity } from '@/types/domain'

type AdminTokenSettingsScreenProps = {
  scope: AdminScope
  rates: TokenRatesData
  communities: readonly Pick<QuilombolaCommunity, 'id' | 'name'>[]
}

export function AdminTokenSettingsScreen({ scope, rates, communities }: AdminTokenSettingsScreenProps) {
  return (
    <>
      <PageHeader
        title="Taxas do token UAIFAI"
        description="Quanto quem envia ganha de volta e quanto um saldo parado perde por semana. Toda mudança passa por uma revisão antes de valer."
      />
      <TokenSettingsPanel
        scope={scope}
        initialSettings={rates.settings}
        initialOverrides={rates.overrides}
        communities={communities}
      />
    </>
  )
}
