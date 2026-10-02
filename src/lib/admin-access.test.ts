import { describe, expect, it } from 'vitest'
import type { AdminScope } from '@/types/domain'
import { adminEntryFor, adminNavFor, canAccessAdminPath, sectionForPath } from './admin-access'

const usp: AdminScope = { kind: 'usp' }
const kalunga: AdminScope = { kind: 'quilombola', communityId: 'kalunga' }

describe('sectionForPath', () => {
  it('maps the admin root to the overview', () => {
    expect(sectionForPath('/admin')).toBe('overview')
  })

  it('maps nested paths to their first segment', () => {
    expect(sectionForPath('/admin/communities/kalunga')).toBe('communities')
  })

  it('returns null for unknown sections', () => {
    expect(sectionForPath('/admin/unknown')).toBeNull()
    expect(sectionForPath('/admin/overview')).toBeNull()
  })
})

describe('adminNavFor', () => {
  it('gives a USP admin every section', () => {
    expect(adminNavFor(usp).map((item) => item.section)).toEqual([
      'overview',
      'courses',
      'distribution-codes',
      'token-settings',
      'users',
      'communities',
    ])
  })

  it('gives a quilombola admin only the rate screen and their own community', () => {
    expect(adminNavFor(kalunga).map((item) => item.href)).toEqual([
      '/admin/token-settings',
      '/admin/communities/kalunga',
    ])
  })
})

describe('canAccessAdminPath', () => {
  it('lets a USP admin open any known section', () => {
    expect(canAccessAdminPath(usp, '/admin')).toBe(true)
    expect(canAccessAdminPath(usp, '/admin/users')).toBe(true)
    expect(canAccessAdminPath(usp, '/admin/communities/kalunga')).toBe(true)
  })

  it('blocks everyone from unknown paths', () => {
    expect(canAccessAdminPath(usp, '/admin/unknown')).toBe(false)
  })

  it('blocks a quilombola admin who types a USP-only URL', () => {
    expect(canAccessAdminPath(kalunga, '/admin')).toBe(false)
    expect(canAccessAdminPath(kalunga, '/admin/users')).toBe(false)
    expect(canAccessAdminPath(kalunga, '/admin/courses')).toBe(false)
    expect(canAccessAdminPath(kalunga, '/admin/distribution-codes')).toBe(false)
  })

  it('limits a quilombola admin to their own community', () => {
    expect(canAccessAdminPath(kalunga, '/admin/communities/kalunga')).toBe(true)
    expect(canAccessAdminPath(kalunga, '/admin/communities/ivaporunduva')).toBe(false)
    expect(canAccessAdminPath(kalunga, '/admin/communities')).toBe(false)
  })

  it('lets a quilombola admin open the rate screen', () => {
    expect(canAccessAdminPath(kalunga, '/admin/token-settings')).toBe(true)
  })
})

describe('adminEntryFor', () => {
  it('sends a USP admin to the overview', () => {
    expect(adminEntryFor(usp)).toEqual({
      href: '/admin',
      scopeLabel: 'Administração USP',
      description: 'Cursos, códigos, taxas e usuários',
    })
  })

  it('sends a quilombola admin straight to their own community', () => {
    expect(adminEntryFor(kalunga)).toEqual({
      href: '/admin/communities/kalunga',
      scopeLabel: 'Administração quilombola',
      description: 'Dados e taxa da sua comunidade',
    })
  })
})
