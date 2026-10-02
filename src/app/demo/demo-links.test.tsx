import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AdminShell } from '@/components/admin/AdminShell'
import { AppShell } from '@/components/app-shell/AppShell'
import type { Result } from '@/data/contracts'
import { demoSource } from '@/data/demo/source'
import { adminEntryFor } from '@/lib/admin-access'
import { AdminCommunitiesScreen } from '@/screens/AdminCommunitiesScreen'
import { AdminOverviewScreen } from '@/screens/AdminOverviewScreen'
import { CoursesScreen } from '@/screens/CoursesScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'

const navigation = vi.hoisted(() => ({ pathname: '/demo/courses' }))
vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))

async function demo<T>(result: Promise<Result<T>>): Promise<T> {
  const settled = await result
  if (settled.status !== 'ok') throw new Error('demo source always answers')
  return settled.data
}

function inDemo(href: string | null) {
  return href === '/demo' || (href?.startsWith('/demo/') ?? false)
}

async function internalHrefs(container: HTMLElement) {
  // The account menu renders its links only while open.
  await userEvent.setup().click(screen.getByRole('button', { name: /Menu da conta/ }))
  return [...container.ownerDocument.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')].map((link) =>
    link.getAttribute('href'),
  )
}

async function renderInDemoShell(screenElement: ReactNode) {
  const admin = await demo(demoSource.getAdmin())
  const { container } = render(
    <AppShell
      mode="demo"
      member={await demo(demoSource.getMember())}
      wallet={await demo(demoSource.getWallet())}
      adminEntry={admin ? adminEntryFor(admin.scope) : null}
    >
      {screenElement}
    </AppShell>,
  )
  return internalHrefs(container)
}

async function renderInDemoAdminShell(screenElement: ReactNode) {
  const admin = await demo(demoSource.getAdmin())
  if (!admin) throw new Error('the demo has an administrator')
  const { container } = render(<AdminShell admin={admin}>{screenElement}</AdminShell>)
  return internalHrefs(container)
}

describe('links inside the demo', () => {
  it('stay under /demo on the courses screen', async () => {
    navigation.pathname = '/demo/courses'
    const hrefs = await renderInDemoShell(<CoursesScreen data={await demo(demoSource.listCourses())} />)

    expect(hrefs.length).toBeGreaterThan(0)
    expect(hrefs.filter((href) => !inDemo(href))).toEqual([])
  })

  it('stay under /demo on the profile screen', async () => {
    navigation.pathname = '/demo/profile'
    const hrefs = await renderInDemoShell(
      <ProfileScreen
        member={await demo(demoSource.getMember())}
        wallet={await demo(demoSource.getWallet())}
        transactions={await demo(demoSource.listTransactions())}
      />,
    )

    expect(hrefs.length).toBeGreaterThan(0)
    expect(hrefs.filter((href) => !inDemo(href))).toEqual([])
  })

  it('stay under /demo/admin on the overview screen', async () => {
    navigation.pathname = '/demo/admin'
    const hrefs = await renderInDemoAdminShell(
      <AdminOverviewScreen analysis={await demo(demoSource.getCommunityAnalysis())} />,
    )

    expect(hrefs).toContain('/demo/admin/users')
    expect(hrefs).toContain('/demo/courses')
    expect(hrefs.filter((href) => !inDemo(href))).toEqual([])
  })

  it('stay under /demo/admin on the communities screen', async () => {
    navigation.pathname = '/demo/admin/communities'
    const { communities } = await demo(demoSource.listCommunities())
    const hrefs = await renderInDemoAdminShell(<AdminCommunitiesScreen communities={communities} mode="demo" />)

    expect(hrefs).toContain(`/demo/admin/communities/${communities[0]?.id}`)
    expect(hrefs.filter((href) => !inDemo(href))).toEqual([])
  })
})
