import 'server-only'
import { cache } from 'react'
import { ok, unavailable, type DataSource } from '../contracts'
import type { Member } from '@/types/domain'
import { ApiError, createApiClient } from './client'
import type { ApiCurrentUser, ApiUser } from './me'
import { toWalletSummary, type ApiWalletSummary } from './wallet'

type ApiClient = ReturnType<typeof createApiClient>
export type ApiSourceDeps = {
  getAccessToken?: () => Promise<string | null>
  client?: ApiClient
}

// Lazy so tests with injected deps never load next/headers.
async function defaultAccessToken(): Promise<string | null> {
  return (await import('@/auth/session')).getAccessToken()
}

// One client for the whole process: `cache` below keys on its identity, so the layout and the page must see the same one.
let defaultClient: ApiClient | undefined
function sharedClient(): ApiClient {
  defaultClient ??= createApiClient({ baseUrl: process.env.API_URL ?? 'http://localhost:8000' })
  return defaultClient
}

function resolve(deps: ApiSourceDeps) {
  return {
    getAccessToken: deps.getAccessToken ?? defaultAccessToken,
    client: deps.client ?? sharedClient(),
  }
}

async function requireToken(getAccessToken: () => Promise<string | null>): Promise<string> {
  const token = await getAccessToken()
  if (token) return token
  throw new ApiError({ status: 401, code: 'unauthorized', title: 'Unauthorized', detail: 'No access token.' })
}

// Memoized per request by argument identity, so getMember and getMemberStatus share one /auth/me call.
const loadCurrentUser = cache(
  async (getAccessToken: () => Promise<string | null>, client: ApiClient): Promise<ApiCurrentUser> =>
    client.request<ApiCurrentUser>('/auth/me', { accessToken: await requireToken(getAccessToken) }),
)

function toMember({ id, name, email, role, isInstitutional }: ApiUser): Member {
  return { id, name, email, role, isInstitutional }
}

export async function getMemberStatus(
  deps: ApiSourceDeps = {},
): Promise<{ member: Member; onboardingRequired: boolean }> {
  const { getAccessToken, client } = resolve(deps)
  const { user, onboardingRequired } = await loadCurrentUser(getAccessToken, client)
  return { member: toMember(user), onboardingRequired }
}

export async function chooseRole(role: 'student' | 'teacher' | 'donor', deps: ApiSourceDeps = {}): Promise<Member> {
  const { getAccessToken, client } = resolve(deps)
  const user = await client.request<ApiUser>('/auth/me/role', {
    method: 'POST',
    body: { role },
    accessToken: await requireToken(getAccessToken),
  })
  return toMember(user)
}

export function createApiSource(deps: ApiSourceDeps = {}): DataSource {
  const { getAccessToken, client } = resolve(deps)
  const currentUser = () => loadCurrentUser(getAccessToken, client).then((me) => me.user)

  return {
    mode: 'real',
    getMember: async () => ok(toMember(await currentUser())),
    getAdmin: async () => {
      const user = await currentUser()
      if (user.role !== 'admin') return ok(null)
      return ok({ id: user.id, name: user.name, email: user.email, scope: { kind: 'usp' } })
    },
    getWallet: async () => {
      const summary = await client.request<ApiWalletSummary>('/wallet/me', {
        accessToken: await requireToken(getAccessToken),
      })
      return ok(toWalletSummary(summary))
    },
    listCourses: async () => unavailable,
    listCirculation: async () => unavailable,
    listTransactions: async () => unavailable,
    listSoulTokens: async () => unavailable,
    getImpact: async () => unavailable,
    listDonations: async () => unavailable,
    getCommunityAnalysis: async () => unavailable,
    listCourseSubmissions: async () => unavailable,
    listDistributionCodes: async () => unavailable,
    getTokenRates: async () => unavailable,
    listManagedUsers: async () => unavailable,
    listCommunities: async () => unavailable,
  }
}
