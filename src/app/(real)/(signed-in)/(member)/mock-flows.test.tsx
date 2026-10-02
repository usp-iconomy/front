import { readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DonatePage from './donate/page'
import ScholarshipsPage from './scholarships/page'

// Redeeming a code or paying a donation here would look real while running on mocks.
const routes = [
  { route: '/scholarships', Page: ScholarshipsPage, title: 'Bolsas e códigos de distribuição', file: 'scholarships/page.tsx' },
  { route: '/donate', Page: DonatePage, title: 'Doar para a comunidade', file: 'donate/page.tsx' },
]

describe.each(routes)('real $route', ({ route, Page, title, file }) => {
  it('always renders "Em construção" with the way to the demo', () => {
    render(<Page />)

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByText('Esta área ainda não está ligada ao servidor.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver na demonstração' })).toHaveAttribute('href', `/demo${route}`)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('never imports the mock flow', () => {
    const source = readFileSync(path.join(__dirname, file), 'utf8')

    expect(source).not.toMatch(/ScholarshipsScreen|RedeemCodeFlow|DonateScreen|DonationFlow/)
    expect(source).not.toMatch(/from ['"]@\/(mocks|data\/demo)/)
  })
})
