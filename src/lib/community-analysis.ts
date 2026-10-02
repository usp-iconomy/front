import type { CourseCirculation, MemberCirculation, MessageSentiment } from '@/types/domain'

/** RF-15 target set by the technical documentation. */
export const VELOCITY_TARGET = 2

/** The documentation says "low circulation" without a number; spec D8 picks 10% of the balance. */
export const UNPAID_DEGREES_MAX_SENT_RATIO = 0.1

const sentiments: readonly MessageSentiment[] = ['positive', 'neutral', 'negative']

export function velocity(tokensCirculated: number, totalSupply: number): number {
  if (totalSupply <= 0) return 0
  return tokensCirculated / totalSupply
}

/** Largest-remainder rounding, so the three bars always add up to 100%. */
export function sentimentShares(counts: Record<MessageSentiment, number>): Record<MessageSentiment, number> {
  const shares: Record<MessageSentiment, number> = { positive: 0, neutral: 0, negative: 0 }
  const total = sentiments.reduce((sum, key) => sum + counts[key], 0)
  if (total === 0) return shares

  const exact = sentiments.map((key) => ({ key, value: (counts[key] / total) * 100 }))
  for (const { key, value } of exact) shares[key] = Math.floor(value)

  let leftover = 100 - sentiments.reduce((sum, key) => sum + shares[key], 0)
  const byRemainder = [...exact].sort(
    (a, b) => b.value - Math.floor(b.value) - (a.value - Math.floor(a.value)),
  )
  for (const { key } of byRemainder) {
    if (leftover === 0) break
    shares[key] += 1
    leftover -= 1
  }
  return shares
}

export function unpaidDegrees(members: readonly MemberCirculation[]): readonly MemberCirculation[] {
  return members
    .filter((member) => member.balance > 0 && member.sent < member.balance * UNPAID_DEGREES_MAX_SENT_RATIO)
    .sort((a, b) => b.balance - a.balance)
}

export function topContributors(members: readonly MemberCirculation[], limit = 5): readonly MemberCirculation[] {
  return members
    .filter((member) => member.sent > 0)
    .sort((a, b) => b.sent - a.sent || a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, limit)
}

export function rankCourses(courses: readonly CourseCirculation[]): readonly CourseCirculation[] {
  return [...courses].sort((a, b) => b.tokensCirculated - a.tokensCirculated)
}
