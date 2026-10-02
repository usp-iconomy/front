import { redirect } from 'next/navigation'
import { pathFor } from '@/lib/mode'

export default function DemoIndexPage() {
  redirect(pathFor('demo', '/courses'))
}
