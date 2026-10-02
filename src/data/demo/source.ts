import { ok, type DataSource } from '../contracts'
import { communityAnalysis } from '@/mocks/admin-analysis'
import { managedUsers } from '@/mocks/admin-users'
import { currentAdmin } from '@/mocks/admin'
import { circulationFeed } from '@/mocks/circulation'
import { quilombolaCommunities, territorialEvents } from '@/mocks/communities'
import { courseSubmissions } from '@/mocks/course-submissions'
import { courses, enrolledCourseIds } from '@/mocks/courses'
import { distributionCodes } from '@/mocks/distribution-codes'
import { donations, reportForDonation } from '@/mocks/donation'
import { activityRecords, impactMetrics } from '@/mocks/impact'
import { demoMember, demoWallet, soulTokens, transactions } from '@/mocks/profile'
import { communityRateOverrides, tokenRateSettings } from '@/mocks/token-settings'

export const demoSource: DataSource = {
  mode: 'demo',
  getMember: async () => ok(demoMember),
  getWallet: async () => ok(demoWallet),
  getAdmin: async () => ok(currentAdmin),
  listCourses: async () => ok({ courses, enrolledCourseIds }),
  listCirculation: async () => ok(circulationFeed),
  listTransactions: async () => ok(transactions),
  listSoulTokens: async () => ok(soulTokens),
  getImpact: async () => ok({ metrics: impactMetrics, activity: activityRecords }),
  listDonations: async () =>
    ok(donations.map((donation) => ({ donation, report: reportForDonation(donation.id) }))),
  getCommunityAnalysis: async () => ok(communityAnalysis),
  listCourseSubmissions: async () => ok(courseSubmissions),
  listDistributionCodes: async () => ok(distributionCodes),
  getTokenRates: async () => ok({ settings: tokenRateSettings, overrides: communityRateOverrides }),
  listManagedUsers: async () => ok(managedUsers),
  listCommunities: async () => ok({ communities: quilombolaCommunities, events: territorialEvents }),
}
