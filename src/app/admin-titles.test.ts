import type { Metadata } from 'next'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/auth/actions', () => ({ signOutAction: vi.fn() }))

type PageModule = { metadata?: Metadata }

const demoPages = import.meta.glob('./demo/admin/**/page.tsx', { eager: true }) as Record<string, PageModule>
const realPages = import.meta.glob('./\\(real\\)/\\(signed-in\\)/admin/**/page.tsx', { eager: true }) as Record<
  string,
  PageModule
>

function titles(pages: Record<string, PageModule>) {
  return Object.entries(pages).map(([file, page]) => [file, String(page.metadata?.title)] as const)
}

describe('admin page titles', () => {
  it('name the page, the administration and the demonstration in the demo', () => {
    const demo = titles(demoPages)
    expect(demo.length).toBeGreaterThanOrEqual(7)
    for (const [file, title] of demo) expect(title, file).toMatch(/^.+ \| Administração \(demonstração\) USP Iconomy$/)
    expect(demo.map(([, title]) => title)).toContain('Visão geral | Administração (demonstração) USP Iconomy')
  })

  it('name the page and the administration in the real tree', () => {
    const real = titles(realPages)
    expect(real.length).toBeGreaterThanOrEqual(7)
    for (const [file, title] of real) expect(title, file).toMatch(/^.+ \| Administração USP Iconomy$/)
  })
})
