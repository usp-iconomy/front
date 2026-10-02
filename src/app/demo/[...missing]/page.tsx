import { notFound } from 'next/navigation'

// Unmatched /demo URLs otherwise fall through to the root 404, outside the demo layout and its links.
export default function DemoMissingPage() {
  notFound()
}
