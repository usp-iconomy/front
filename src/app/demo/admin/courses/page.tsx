import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { AdminCoursesScreen } from '@/screens/AdminCoursesScreen'

export const metadata: Metadata = { title: 'Aprovação de cursos — Administração (demonstração) USP Iconomy' }

export default async function AdminCoursesPage() {
  const [submissions, admin] = await Promise.all([demoSource.listCourseSubmissions(), demoSource.getAdmin()])
  if (submissions.status !== 'ok' || admin.status !== 'ok' || !admin.data) {
    throw new Error('demo source always answers')
  }
  return <AdminCoursesScreen submissions={submissions.data} reviewerName={admin.data.name} />
}
