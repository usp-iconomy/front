import type { Metadata } from 'next'
import { Divider, PageHeader, SectionHeader } from '@/design-system'
import { FeedItem } from '@/components/circulation/FeedItem'
import { SendCirculationForm } from '@/components/circulation/SendCirculationForm'
import { circulationFeed } from '@/mocks/circulation'

export const metadata: Metadata = { title: 'Circulação — USP Iconomy' }

export default function CirculationPage() {
  return (
    <>
      <PageHeader
        title="Circulação"
        description="Cada transferência carrega uma mensagem. O feed é público porque o reconhecimento também é."
      />

      <SectionHeader title="Feed recente" />
      {circulationFeed.map((entry) => (
        <FeedItem key={entry.id} entry={entry} />
      ))}

      <Divider />

      <SendCirculationForm />
    </>
  )
}
