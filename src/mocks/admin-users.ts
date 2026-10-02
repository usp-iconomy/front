import type { ManagedUser } from '@/types/domain'

export const managedUsers: readonly ManagedUser[] = [
  { id: 'admin-usp-1', name: 'Helena Prado', email: 'helena.prado@usp.br', role: 'admin', joinedAt: '2026-02-10T12:00:00Z', tokenBalance: 300, sent30d: 120 },
  { id: 'user-rl', name: 'Rafael Lima', email: 'rafael.lima@usp.br', role: 'admin', joinedAt: '2026-02-12T12:00:00Z', tokenBalance: 1500, sent30d: 40 },
  { id: 'user-js', name: 'João Santos', email: 'joao.santos@usp.br', role: 'teacher', joinedAt: '2026-03-02T12:00:00Z', tokenBalance: 620, sent30d: 240 },
  { id: 'user-ac', name: 'Ana Costa', email: 'ana.costa@usp.br', role: 'teacher', joinedAt: '2026-03-05T12:00:00Z', tokenBalance: 380, sent30d: 95 },
  { id: 'user-mj', name: 'Maria Joana', email: 'maria.joana@gmail.com', role: 'student', joinedAt: '2026-04-18T12:00:00Z', tokenBalance: 450, sent30d: 180 },
  { id: 'user-tc', name: 'Tereza Conceição', email: 'tereza.conceicao@gmail.com', role: 'student', joinedAt: '2026-05-21T12:00:00Z', tokenBalance: 210, sent30d: 160 },
  { id: 'user-pv', name: 'Paulo Vieira', email: 'paulo.vieira@usp.br', role: 'student', joinedAt: '2026-06-03T12:00:00Z', tokenBalance: 900, sent30d: 0 },
  { id: 'user-fi', name: 'Fundação Ipê', email: 'contato@fundacaoipe.org.br', role: 'donor', joinedAt: '2026-08-24T12:00:00Z', tokenBalance: 0, sent30d: 0 },
]
