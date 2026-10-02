import type { Metadata } from 'next'
import { createApiSource } from '@/data/api/source'
import { CoursesScreen } from '@/screens/CoursesScreen'
import { UnderConstruction } from '@/screens/UnderConstruction'

export const metadata: Metadata = { title: 'Descobrir cursos | USP Iconomy' }

export default async function CoursesPage() {
  const courses = await createApiSource().listCourses()
  if (courses.status !== 'ok') return <UnderConstruction title="Descobrir cursos" demoPath="/demo/courses" />
  return <CoursesScreen data={courses.data} />
}
