import type { Metadata } from 'next'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Aprovação de cursos | Administração USP Iconomy' }

export default function AdminCoursesPage() {
  return <UnderConstruction title="Aprovação de cursos" demoPath="/demo/admin/courses" />
}
