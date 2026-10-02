import type { Mode } from '@/lib/mode'
import type {
  ActivityRecord,
  AdminUser,
  CirculationEntry,
  CommunityAnalysis,
  CommunityRateOverride,
  Course,
  CourseSubmission,
  DistributionCode,
  Donation,
  DonorReport,
  ImpactMetric,
  ManagedUser,
  Member,
  QuilombolaCommunity,
  SoulToken,
  TerritorialEvent,
  TokenRateSettings,
  Transaction,
  WalletSummary,
} from '@/types/domain'

export type Unavailable = { status: 'unavailable' }
export type Available<T> = { status: 'ok'; data: T }
export type Result<T> = Available<T> | Unavailable

export const unavailable: Unavailable = { status: 'unavailable' }
export function ok<T>(data: T): Available<T> {
  return { status: 'ok', data }
}

export type CourseCatalogData = { courses: readonly Course[]; enrolledCourseIds: readonly string[] }
export type ImpactData = { metrics: readonly ImpactMetric[]; activity: readonly ActivityRecord[] }
export type DonationHistoryEntry = { donation: Donation; report: DonorReport | undefined }
export type TokenRatesData = { settings: TokenRateSettings; overrides: readonly CommunityRateOverride[] }
export type CommunitiesData = {
  communities: readonly QuilombolaCommunity[]
  events: readonly TerritorialEvent[]
}

/** Each area of the app. The demo answers everything; the API answers what the backend serves. */
export type DataSource = {
  mode: Mode
  getMember(): Promise<Result<Member>>
  getWallet(): Promise<Result<WalletSummary>>
  /** `ok(null)` means "signed in, not an administrator". */
  getAdmin(): Promise<Result<AdminUser | null>>
  listCourses(): Promise<Result<CourseCatalogData>>
  listCirculation(): Promise<Result<readonly CirculationEntry[]>>
  listTransactions(): Promise<Result<readonly Transaction[]>>
  listSoulTokens(): Promise<Result<readonly SoulToken[]>>
  getImpact(): Promise<Result<ImpactData>>
  listDonations(): Promise<Result<readonly DonationHistoryEntry[]>>
  getCommunityAnalysis(): Promise<Result<CommunityAnalysis>>
  listCourseSubmissions(): Promise<Result<readonly CourseSubmission[]>>
  listDistributionCodes(): Promise<Result<readonly DistributionCode[]>>
  getTokenRates(): Promise<Result<TokenRatesData>>
  listManagedUsers(): Promise<Result<readonly ManagedUser[]>>
  listCommunities(): Promise<Result<CommunitiesData>>
}
