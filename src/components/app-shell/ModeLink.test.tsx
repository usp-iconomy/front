import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ModeLink } from './ModeLink'

const navigation = vi.hoisted(() => ({ pathname: '/demo/courses' }))
vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))

describe('ModeLink', () => {
  it('keeps a demo link inside the demo tree', () => {
    navigation.pathname = '/demo/courses'
    render(<ModeLink href="/profile">Perfil</ModeLink>)
    expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/demo/profile')
  })

  it('leaves real links unprefixed', () => {
    navigation.pathname = '/courses'
    render(<ModeLink href="/profile">Perfil</ModeLink>)
    expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/profile')
  })
})
