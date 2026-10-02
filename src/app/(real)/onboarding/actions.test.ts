import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/data/api/client'
import { chooseRoleAction } from './actions'

const mocks = vi.hoisted(() => ({
  chooseRole: vi.fn(),
  getMemberStatus: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))
vi.mock('@/data/api/source', () => ({ chooseRole: mocks.chooseRole, getMemberStatus: mocks.getMemberStatus }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))

function form(role?: string) {
  const data = new FormData()
  if (role !== undefined) data.set('role', role)
  return data
}

function apiError(status: number, detail = '') {
  return new ApiError({ status, code: `http_${status}`, title: `HTTP ${status}`, detail })
}

describe('chooseRoleAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('saves the role and goes to the courses without reading the member again', async () => {
    mocks.chooseRole.mockResolvedValue({ id: 'u1', role: 'student' })

    await expect(chooseRoleAction({ error: null, role: null }, form('student'))).rejects.toThrow('redirect:/courses')
    expect(mocks.chooseRole).toHaveBeenCalledWith('student')
    expect(mocks.getMemberStatus).not.toHaveBeenCalled()
  })

  it('refuses administration and empty choices without calling the API', async () => {
    expect(await chooseRoleAction({ error: null, role: null }, form('admin'))).toEqual({ error: 'Escolha um perfil para continuar.', role: null })
    expect(await chooseRoleAction({ error: null, role: null }, form())).toEqual({ error: 'Escolha um perfil para continuar.', role: null })
    expect(mocks.chooseRole).not.toHaveBeenCalled()
  })

  it("shows the API's detail on 422", async () => {
    mocks.chooseRole.mockRejectedValue(apiError(422, 'role must be one of: student, teacher, donor'))

    expect(await chooseRoleAction({ error: null, role: null }, form('donor'))).toEqual({
      error: 'role must be one of: student, teacher, donor',
      role: 'donor',
    })
  })

  it('sends an expired session back to the entry page', async () => {
    mocks.chooseRole.mockRejectedValue(apiError(401))

    await expect(chooseRoleAction({ error: null, role: null }, form('teacher'))).rejects.toThrow(
      'redirect:/?reason=session-expired',
    )
  })

  it('treats a role chosen elsewhere as finished onboarding', async () => {
    mocks.chooseRole.mockRejectedValue(apiError(409, 'A role has already been chosen for this account.'))

    await expect(chooseRoleAction({ error: null, role: null }, form('student'))).rejects.toThrow('redirect:/courses')
  })

  it('lets server failures reach the error boundary', async () => {
    const failure = apiError(503)
    mocks.chooseRole.mockRejectedValue(failure)

    await expect(chooseRoleAction({ error: null, role: null }, form('student'))).rejects.toBe(failure)
  })
})
