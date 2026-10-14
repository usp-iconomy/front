import { describe, expect, it, vi } from 'vitest'
import type { DataSource } from '../contracts'
import { ApiError, type createApiClient } from './client'
import type { ApiCurrentUser, ApiUser } from './me'
import { chooseRole, createApiSource, getMemberStatus } from './source'

type Method = Exclude<keyof DataSource, 'mode'>

// A Record keyed by the type makes a new DataSource method a compile error here.
const unservedMethods: Record<Exclude<Method, 'getMember' | 'getAdmin' | 'getWallet'>, true> = {
  listCourses: true,
  listCirculation: true,
  listTransactions: true,
  listSoulTokens: true,
  getImpact: true,
  listDonations: true,
  getCommunityAnalysis: true,
  listCourseSubmissions: true,
  listDistributionCodes: true,
  getTokenRates: true,
  listManagedUsers: true,
  listCommunities: true,
}

const apiUser: ApiUser = {
  id: 'u-1',
  email: 'ana@usp.br',
  name: 'Ana Souza',
  role: 'student',
  isInstitutional: true,
  createdAt: '2026-01-01T00:00:00Z',
}

function setup(payload: Partial<ApiCurrentUser> = {}, token: string | null = 'tok') {
  const request = vi.fn(async (path: string) =>
    path === '/auth/me'
      ? ({ user: apiUser, onboardingRequired: false, emailVerified: true, ...payload } satisfies ApiCurrentUser)
      : apiUser,
  )
  const deps = {
    getAccessToken: async () => token,
    client: { request } as unknown as ReturnType<typeof createApiClient>,
  }
  return { request, deps }
}

describe('createApiSource', () => {
  it('is the real source', () => {
    expect(createApiSource(setup().deps).mode).toBe('real')
  })

  it('maps the signed-in user to a member without createdAt', async () => {
    const { deps, request } = setup()
    const result = await createApiSource(deps).getMember()
    expect(result).toEqual({
      status: 'ok',
      data: { id: 'u-1', name: 'Ana Souza', email: 'ana@usp.br', role: 'student', isInstitutional: true },
    })
    expect(request).toHaveBeenCalledWith('/auth/me', { accessToken: 'tok' })
  })

  it('throws a 401 ApiError without an access token, never unavailable', async () => {
    const { deps, request } = setup({}, null)
    const error = await createApiSource(deps)
      .getMember()
      .catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 401, code: 'unauthorized' })
    expect(request).not.toHaveBeenCalled()
  })

  it('answers the administrator for role admin, scoped to USP', async () => {
    const { deps } = setup({ user: { ...apiUser, role: 'admin' } })
    expect(await createApiSource(deps).getAdmin()).toEqual({
      status: 'ok',
      data: { id: 'u-1', name: 'Ana Souza', email: 'ana@usp.br', scope: { kind: 'usp' } },
    })
  })

  it.each(['student', 'teacher', 'donor', null] as const)('answers ok(null) for admin when role is %s', async (role) => {
    const { deps } = setup({ user: { ...apiUser, role } })
    expect(await createApiSource(deps).getAdmin()).toEqual({ status: 'ok', data: null })
  })

  it('maps /wallet/me to a WalletSummary', async () => {
    const walletPayload = {
      tokenBalance: 1_000_000,
      circulationCount: 0,
      soulTokenCount: 0,
      reputationStars: 5 as const,
      reputationLabel: 'Semeadora',
    }
    const request = vi.fn(async (path: string) =>
      path === '/wallet/me' ? walletPayload : ({ user: apiUser, onboardingRequired: false, emailVerified: true } satisfies ApiCurrentUser),
    )
    const deps = {
      getAccessToken: async () => 'tok',
      client: { request } as unknown as ReturnType<typeof createApiClient>,
    }
    expect(await createApiSource(deps).getWallet()).toEqual({ status: 'ok', data: walletPayload })
    expect(request).toHaveBeenCalledWith('/wallet/me', { accessToken: 'tok' })
  })

  it('throws a 401 ApiError from getWallet without an access token', async () => {
    const { deps, request } = setup({}, null)
    const error = await createApiSource(deps)
      .getWallet()
      .catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 401, code: 'unauthorized' })
    expect(request).not.toHaveBeenCalled()
  })

  it.each(Object.keys(unservedMethods) as (keyof typeof unservedMethods)[])(
    '%s is unavailable and never calls the API',
    async (method) => {
      const { deps, request } = setup()
      expect(await createApiSource(deps)[method]()).toEqual({ status: 'unavailable' })
      expect(request).not.toHaveBeenCalled()
    },
  )
})

describe('getMemberStatus', () => {
  it.each([true, false])('returns onboardingRequired=%s from the payload', async (onboardingRequired) => {
    const { deps } = setup({ onboardingRequired })
    const status = await getMemberStatus(deps)
    expect(status.onboardingRequired).toBe(onboardingRequired)
    expect(status.member).toEqual({
      id: 'u-1',
      name: 'Ana Souza',
      email: 'ana@usp.br',
      role: 'student',
      isInstitutional: true,
    })
  })
})

describe('chooseRole', () => {
  it('posts the role and maps the returned user', async () => {
    const { deps, request } = setup()
    request.mockResolvedValueOnce({ ...apiUser, role: 'teacher' })
    const member = await chooseRole('teacher', deps)
    expect(request).toHaveBeenCalledWith('/auth/me/role', {
      method: 'POST',
      body: { role: 'teacher' },
      accessToken: 'tok',
    })
    expect(member).toEqual({
      id: 'u-1',
      name: 'Ana Souza',
      email: 'ana@usp.br',
      role: 'teacher',
      isInstitutional: true,
    })
  })

  it('throws a 401 ApiError without an access token', async () => {
    const { deps, request } = setup({}, null)
    await expect(chooseRole('donor', deps)).rejects.toMatchObject({ status: 401, code: 'unauthorized' })
    expect(request).not.toHaveBeenCalled()
  })
})
