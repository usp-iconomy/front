import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const session = vi.hoisted(() => ({ current: null as unknown }))
vi.mock('@/auth', () => ({ auth: async () => session.current }))
vi.mock('@/auth/actions', () => ({ signInAction: vi.fn(), signUpAction: vi.fn(), signOutAction: vi.fn() }))

import HomePage from './page'

async function renderHome(searchParams: Record<string, string | string[]> = {}) {
  render(await HomePage({ searchParams: Promise.resolve(searchParams) }))
}

function nextValue() {
  return screen.getByRole('button', { name: 'Entrar' }).closest('form')!.querySelector<HTMLInputElement>('input[name="next"]')!.value
}

describe('entry page', () => {
  beforeEach(() => {
    session.current = null
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
  })

  it('shows the sign-in without a session', async () => {
    await renderHome()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(nextValue()).toBe('/courses')
  })

  it('continues as the signed-in member', async () => {
    session.current = { user: { name: 'Maria Joana' } }
    await renderHome()
    expect(screen.getByRole('link', { name: 'Continuar como Maria Joana' })).toBeInTheDocument()
  })

  it('keeps a session with neither name nor email signed in', async () => {
    session.current = { user: {} }
    await renderHome()
    expect(screen.getByRole('link', { name: 'Continuar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument()
  })

  it('falls back to /courses instead of throwing on a malformed AUTH_URL', async () => {
    vi.stubEnv('AUTH_URL', 'localhost:3000')
    await renderHome({ callbackUrl: 'http://localhost:3000/admin' })
    expect(nextValue()).toBe('/courses')
  })

  it('treats a failed refresh as signed out', async () => {
    session.current = { user: { name: 'Maria Joana' }, error: 'RefreshFailed' }
    await renderHome({ reason: 'session-expired' })
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Continuar como/ })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Sua sessão expirou.')
  })

  it('takes the destination from an absolute callbackUrl on the app origin', async () => {
    await renderHome({ callbackUrl: 'http://localhost:3000/admin/users?tab=roles' })
    expect(nextValue()).toBe('/admin/users?tab=roles')
  })

  it('ignores a callbackUrl from another origin', async () => {
    await renderHome({ callbackUrl: 'https://evil.example/courses' })
    expect(nextValue()).toBe('/courses')
  })
})
