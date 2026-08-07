/**
 * Domain model for USP Iconomy, following the vocabulary of the technical
 * documentation (RF-01..RF-15). Portuguese labels live in the UI layer, never
 * here. All instants are UTC ISO 8601 strings; formatting is the view's job.
 */

/** RF-04 — the four ways a course grants access. */
export type AccessType = 'open' | 'circulation' | 'distribution_code' | 'sbt'

/** RF-01 — user kinds recognised by the platform. */
export type UserRole = 'student' | 'teacher' | 'admin' | 'donor'

export type Course = {
  id: string
  title: string
  instructor: string
  description: string
  /** A course can combine access types, e.g. open plus scholarship code. */
  accessTypes: readonly AccessType[]
  participants: number
  workloadHours: number
  /** RF-05 — whether completion mints an SBT. */
  issuesSbt: boolean
  /** RF-12 — in-person courses record GPS coordinates in the SBT. */
  inPerson: boolean
}

/** RF-08 — one entry of the public circulation feed. */
export type CirculationEntry = {
  id: string
  senderName: string
  recipientName: string
  amount: number
  /** RN-02 — never empty: a transfer without a message is not processed. */
  message: string
  occurredAt: string
  courseTitle?: string
}

export type TransactionKind = 'sent' | 'received' | 'sbt_issued'
export type TransactionStatus = 'completed' | 'issued' | 'pending'

export type Transaction = {
  id: string
  kind: TransactionKind
  description: string
  /** Null for SBT issuance, which moves no tokens. */
  amount: number | null
  occurredAt: string
  status: TransactionStatus
}

/** RF-05 — a Soulbound Token, shown to members as "Token Alma". */
export type SoulToken = {
  id: string
  courseTitle: string
  issuedAt: string
  /** RN-04 — always false. Present so the UI states it rather than assumes it. */
  transferable: false
  /** Territory or venue, for in-person and quilombola activities. */
  place?: string
}

/** RF-11, RF-15 — a headline number on the impact dashboard. */
export type ImpactMetric = {
  id: string
  label: string
  /** Preformatted for pt-BR, since the source is an aggregate, not a raw count. */
  value: string
  delta: string
}

export type ActivityRecord = {
  id: string
  occurredAt: string
  event: string
  participants: number
  impact: string
}

/** RF-02 — the signed-in member's reputation profile. */
export type CurrentUser = {
  id: string
  name: string
  role: UserRole
  tokenBalance: number
  /** RN-03 — access is judged by what circulated, not by what is held. */
  circulationCount: number
  soulTokenCount: number
  reputationStars: 1 | 2 | 3 | 4 | 5
  reputationLabel: string
}
