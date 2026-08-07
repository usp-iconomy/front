import type { Metadata } from 'next'
import { PageHeader } from '@/design-system'
import { CourseCatalog } from '@/components/courses/CourseCatalog'
import { courses, enrolledCourseIds } from '@/mocks/courses'

export const metadata: Metadata = { title: 'Descobrir cursos — USP Iconomy' }

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        title="Descobrir cursos"
        description="Conhecimento que circula, transforma. Explore cursos, reconheça contribuições e construa sua trajetória coletiva."
      />
      <CourseCatalog courses={courses} initialEnrolledIds={enrolledCourseIds} />
    </>
  )
}
