import type { CirculationEntry } from '@/types/domain'

export const circulationFeed: readonly CirculationEntry[] = [
  {
    id: 'feed-1',
    senderName: 'Maria Gomes',
    recipientName: 'João Santos',
    amount: 50,
    message: 'Obrigada pela facilitação incrível!',
    occurredAt: '2026-08-07T10:20:00Z',
    courseTitle: 'Tecnologia e Descolonialidade',
  },
  {
    id: 'feed-2',
    senderName: 'Coletivo Malê',
    recipientName: 'Lucia Martins',
    amount: 100,
    message: 'Sua pesquisa transformou nossa comunidade.',
    occurredAt: '2026-08-07T08:05:00Z',
  },
  {
    id: 'feed-3',
    senderName: 'Paulo Souza',
    recipientName: 'Rede Quilombola',
    amount: 75,
    message: 'Apoio ao trabalho de organização comunitária.',
    occurredAt: '2026-08-07T06:40:00Z',
  },
  {
    id: 'feed-4',
    senderName: 'Ana Lopes',
    recipientName: 'Pedro Oliveira',
    amount: 60,
    message: 'Muito obrigada pela mentoria destas últimas semanas.',
    occurredAt: '2026-08-07T04:15:00Z',
    courseTitle: 'Design Comunitário',
  },
]
