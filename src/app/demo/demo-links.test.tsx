import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AppShell } from '@/components/app-shell/AppShell'
import type { Result } from '@/data/contracts'
import { demoSource } from '@/data/demo/source'
import { adminEntryFor } from '@/lib/admin-access'
import { CoursesScreen } from '@/screens/CoursesScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'

const navigation = vi.hoisted(() => ({ pathname: '/demo/courses' }))
vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))

async function demo<T>(result: Promise<Result<T>>): Promise<T> {
  const settled = await result
  if (settled.status !== 'ok') throw new Error('demo source always answers')
  return settled.data
}

async function renderInDemoShell(screenElement: ReactNode) {
  const admin = await demo(demoSource.getAdmin())
  const user = userEvent.setup()
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
  // The account menu renders its links only while open.
  await user.click(screen.getByRole('button', { name: /Menu da conta/ }))
  return [...container.ownerDocument.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')].map((link) =>
    link.getAttribute('href'),
  )
}

describe('links inside the demo', () => {
  it('stay under /demo on the courses screen', async () => {
    navigation.pathname = '/demo/courses'
    const hrefs = await renderInDemoShell(<CoursesScreen data={await demo(demoSource.listCourses())} />)

    expect(hrefs.length).toBeGreaterThan(0)
    expect(hrefs.filter((href) => !href?.startsWith('/demo'))).toEqual([])
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
    expect(hrefs.filter((href) => !href?.startsWith('/demo'))).toEqual([])
  })
})
