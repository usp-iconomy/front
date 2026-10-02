import { PageHeader } from '@/design-system'
import { CourseCatalog } from '@/components/courses/CourseCatalog'
import type { CourseCatalogData } from '@/data/contracts'

export function CoursesScreen({ data }: { data: CourseCatalogData }) {
  return (
    <>
      <PageHeader
        title="Descobrir cursos"
        description="Conhecimento que circula, transforma. Explore cursos, reconheça contribuições e construa sua trajetória coletiva."
      />
      <CourseCatalog courses={data.courses} initialEnrolledIds={data.enrolledCourseIds} />
    </>
  )
}
