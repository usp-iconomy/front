import type { CommunityAnalysis } from '@/types/domain'

export const communityAnalysis: CommunityAnalysis = {
  periodStart: '2026-09-01T03:00:00Z',
  periodEnd: '2026-10-01T02:59:59Z',
  tokensCirculated: 48500,
  totalSupply: 21000,
  sentimentCounts: { positive: 412, neutral: 131, negative: 19 },
  members: [
    { memberId: 'user-mj', name: 'Maria Joana', balance: 450, sent: 180 },
    { memberId: 'user-js', name: 'João Santos', balance: 620, sent: 240 },
    { memberId: 'user-ac', name: 'Ana Costa', balance: 380, sent: 95 },
    { memberId: 'user-rl', name: 'Rafael Lima', balance: 1500, sent: 40 },
    { memberId: 'user-tc', name: 'Tereza Conceição', balance: 210, sent: 160 },
    { memberId: 'user-pv', name: 'Paulo Vieira', balance: 900, sent: 0 },
    { memberId: 'user-cm', name: 'Carla Mendes', balance: 0, sent: 0 },
    { memberId: 'user-lo', name: 'Lucas Oliveira', balance: 300, sent: 75 },
  ],
  courses: [
    { courseId: 'economia-simbolica-101', title: 'Economia Simbólica 101', tokensCirculated: 9800 },
    { courseId: 'tecnologia-e-descolonialidade', title: 'Tecnologia e Descolonialidade', tokensCirculated: 7200 },
    { courseId: 'design-comunitario', title: 'Design Comunitário', tokensCirculated: 4100 },
    { courseId: 'governanca-de-dados', title: 'Governança de Dados', tokensCirculated: 1900 },
    { courseId: 'lideranca-feminista', title: 'Liderança Feminista', tokensCirculated: 8600 },
    { courseId: 'impacto-social-medido', title: 'Impacto Social Medido', tokensCirculated: 6300 },
  ],
}
