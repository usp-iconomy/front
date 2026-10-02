import type { Metadata } from 'next'
import { PageHeader } from '@/design-system'
import { DistributionCodeManager } from '@/components/admin/DistributionCodeManager'
import { courses } from '@/mocks/courses'
import { distributionCodes } from '@/mocks/distribution-codes'

export const metadata: Metadata = { title: 'Códigos de distribuição — Administração USP Iconomy' }

export default function AdminDistributionCodesPage() {
  return (
    <>
      <PageHeader
        title="Códigos de distribuição"
        description="Bolsas de acesso para quem ainda não tem histórico de circulação. Exporte em CSV para enviar pelos parceiros locais."
      />
      <DistributionCodeManager
        initialCodes={distributionCodes}
        courses={courses.map(({ id, title }) => ({ id, title }))}
      />
    </>
  )
}
