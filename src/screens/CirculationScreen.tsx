import { Divider, PageHeader, SectionHeader } from '@/design-system'
import { FeedItem } from '@/components/circulation/FeedItem'
import { SendCirculationForm } from '@/components/circulation/SendCirculationForm'
import type { CirculationEntry } from '@/types/domain'

export function CirculationScreen({ feed }: { feed: readonly CirculationEntry[] }) {
  return (
    <>
      <PageHeader
        title="Circulação"
        description="Cada transferência carrega uma mensagem. O feed é público porque o reconhecimento também é."
      />

      <SectionHeader title="Feed recente" />
      {feed.map((entry) => (
        <FeedItem key={entry.id} entry={entry} />
      ))}

      <Divider />

      <SendCirculationForm />
    </>
  )
}
