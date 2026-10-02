import { Divider, InfoBox, PageHeader } from '@/design-system'
import { SoulTokenCard, SoulTokenGrid } from '@/components/achievements/SoulTokenCard'
import type { SoulToken } from '@/types/domain'

export function AchievementsScreen({ soulTokens }: { soulTokens: readonly SoulToken[] }) {
  return (
    <>
      <PageHeader
        title="Meus Tokens Alma"
        description="Certificados não-transferíveis que registram sua participação real na comunidade."
      />

      <SoulTokenGrid>
        {soulTokens.map((token) => (
          <SoulTokenCard key={token.id} token={token} />
        ))}
      </SoulTokenGrid>

      <Divider />

      <InfoBox title="O que são Tokens Alma?" icon="shield">
        São certificados digitais que ficam permanentemente ligados à sua carteira. Diferente dos tokens UAIFAI,
        que circulam, um Token Alma não pode ser vendido, transferido ou delegado. Ele prova participação — em um
        curso, em uma oficina, em uma assembleia — e, quando a atividade é presencial, registra também o local e a
        data. Para comunidades quilombolas, isso constitui um registro de pertença territorial que não depende de
        cadastro administrativo.
      </InfoBox>
    </>
  )
}
