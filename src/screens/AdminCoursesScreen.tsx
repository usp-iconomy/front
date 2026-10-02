import { PageHeader } from '@/design-system'
import { CourseReviewWorkspace } from '@/components/admin/CourseReviewWorkspace'
import type { CourseSubmission } from '@/types/domain'

type AdminCoursesScreenProps = { submissions: readonly CourseSubmission[]; reviewerName: string }

export function AdminCoursesScreen({ submissions, reviewerName }: AdminCoursesScreenProps) {
  return (
    <>
      <PageHeader
        title="Aprovação de cursos"
        description="Cursos enviados por docentes passam por aqui antes de entrar no catálogo. Para pedir ajustes ou rejeitar, deixe um comentário explicando o motivo."
      />
      <CourseReviewWorkspace initialSubmissions={submissions} reviewerName={reviewerName} />
    </>
  )
}
