import type { Metadata } from 'next'
import { Divider, InfoBox, PageHeader } from '@/design-system'
import { RedeemCodeFlow } from '@/components/scholarships/RedeemCodeFlow'

export const metadata: Metadata = { title: 'Bolsas e códigos de distribuição — USP Iconomy' }

const howItWorks = [
  'Cada código é único e vale um resgate por pessoa',
  'São distribuídos por parceiros comunitários, facilitadores e pela própria USP',
  'Têm data de validade: códigos expirados são invalidados automaticamente',
  'O uso é rastreado para o relatório de impacto, sem expor dados pessoais',
] as const

export default function ScholarshipsPage() {
  return (
    <>
      <PageHeader
        title="Bolsas e códigos de distribuição"
        description="A porta de entrada para quem ainda não tem histórico de circulação. Resgate um código e comece a participar."
      />

      <RedeemCodeFlow />

      <Divider />

      <InfoBox title="Como funcionam os códigos" icon="ticket" items={howItWorks} />
    </>
  )
}
