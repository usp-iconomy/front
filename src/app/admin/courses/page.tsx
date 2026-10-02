import type { Metadata } from 'next'
import { PageHeader } from '@/design-system'
import { CourseReviewWorkspace } from '@/components/admin/CourseReviewWorkspace'
import { currentAdmin } from '@/mocks/admin'
import { courseSubmissions } from '@/mocks/course-submissions'

export const metadata: Metadata = { title: 'Aprovação de cursos — Administração USP Iconomy' }

export default function AdminCoursesPage() {
  return (
    <>
      <PageHeader
        title="Aprovação de cursos"
        description="Cursos enviados por docentes passam por aqui antes de entrar no catálogo. Para pedir ajustes ou rejeitar, deixe um comentário explicando o motivo."
      />
      <CourseReviewWorkspace initialSubmissions={courseSubmissions} reviewerName={currentAdmin.name} />
    </>
  )
}
