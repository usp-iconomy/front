import { PageHeader } from '@/design-system'
import { DistributionCodeManager } from '@/components/admin/DistributionCodeManager'
import type { DistributionCode } from '@/types/domain'

type AdminDistributionCodesScreenProps = {
  codes: readonly DistributionCode[]
  courses: readonly { id: string; title: string }[]
}

export function AdminDistributionCodesScreen({ codes, courses }: AdminDistributionCodesScreenProps) {
  return (
    <>
      <PageHeader
        title="Códigos de distribuição"
        description="Bolsas de acesso para quem ainda não tem histórico de circulação. Exporte em CSV para enviar pelos parceiros locais."
      />
      <DistributionCodeManager initialCodes={codes} courses={courses} />
    </>
  )
}
