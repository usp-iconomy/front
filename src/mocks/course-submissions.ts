import type { Course, CourseSubmission } from '@/types/domain'

function course(overrides: Pick<Course, 'id' | 'title' | 'instructor' | 'description'> & Partial<Course>): Course {
  return {
    accessTypes: ['open'],
    participants: 0,
    workloadHours: 12,
    issuesSbt: true,
    inPerson: false,
    ...overrides,
  }
}

export const courseSubmissions: readonly CourseSubmission[] = [
  {
    course: course({
      id: 'cartografia-social',
      title: 'Cartografia Social',
      instructor: 'Profa. Lia Ramos',
      description: 'Mapeamento participativo de territórios com lideranças comunitárias.',
      accessTypes: ['open', 'distribution_code'],
      inPerson: true,
    }),
    submittedBy: 'Profa. Lia Ramos',
    status: 'pending_review',
    history: [{ status: 'pending_review', at: '2026-09-28T13:20:00Z', actorName: 'Profa. Lia Ramos' }],
  },
  {
    course: course({
      id: 'agroecologia-urbana',
      title: 'Agroecologia Urbana',
      instructor: 'Prof. Davi Nunes',
      description: 'Hortas comunitárias e circulação de saberes sobre alimento.',
      accessTypes: ['circulation'],
      workloadHours: 16,
    }),
    submittedBy: 'Prof. Davi Nunes',
    status: 'pending_review',
    history: [{ status: 'pending_review', at: '2026-09-30T18:05:00Z', actorName: 'Prof. Davi Nunes' }],
  },
  {
    course: course({
      id: 'financas-para-coletivos',
      title: 'Finanças para Coletivos',
      instructor: 'Profa. Rita Moura',
      description: 'Gestão financeira para associações e coletivos culturais.',
      accessTypes: ['sbt'],
    }),
    submittedBy: 'Profa. Rita Moura',
    status: 'changes_requested',
    history: [
      { status: 'pending_review', at: '2026-09-15T11:00:00Z', actorName: 'Profa. Rita Moura' },
      {
        status: 'changes_requested',
        at: '2026-09-17T14:30:00Z',
        actorName: 'Helena Prado',
        note: 'Indique qual Token Alma é pré-requisito; o curso está marcado como Tipo 4 sem SBT vinculado.',
      },
    ],
  },
  {
    course: course({
      id: 'memoria-oral',
      title: 'Memória Oral',
      instructor: 'Prof. Antônio Reis',
      description: 'Registro de histórias de vida com comunidades tradicionais.',
    }),
    submittedBy: 'Prof. Antônio Reis',
    status: 'published',
    history: [
      { status: 'pending_review', at: '2026-09-02T09:00:00Z', actorName: 'Prof. Antônio Reis' },
      { status: 'published', at: '2026-09-03T10:10:00Z', actorName: 'Helena Prado' },
    ],
  },
]
