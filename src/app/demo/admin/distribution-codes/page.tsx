import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { AdminDistributionCodesScreen } from '@/screens/AdminDistributionCodesScreen'

export const metadata: Metadata = { title: 'Códigos de distribuição — Demonstração USP Iconomy' }

export default async function AdminDistributionCodesPage() {
  const [codes, courses] = await Promise.all([demoSource.listDistributionCodes(), demoSource.listCourses()])
  if (codes.status !== 'ok' || courses.status !== 'ok') throw new Error('demo source always answers')
  return (
    <AdminDistributionCodesScreen
      codes={codes.data}
      courses={courses.data.courses.map(({ id, title }) => ({ id, title }))}
    />
  )
}
