import type { Metadata } from 'next'
import { demoSource } from '@/data/demo/source'
import { CoursesScreen } from '@/screens/CoursesScreen'

export const metadata: Metadata = { title: 'Descobrir cursos — Demonstração USP Iconomy' }

export default async function DemoCoursesPage() {
  const courses = await demoSource.listCourses()
  if (courses.status !== 'ok') throw new Error('demo source always answers')
  return <CoursesScreen data={courses.data} />
}
