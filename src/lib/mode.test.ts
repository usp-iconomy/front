import { describe, expect, it } from 'vitest'
import { modeFromPath, pathFor, stripMode } from './mode'

describe('modeFromPath', () => {
  it('reads the demo prefix as a whole segment', () => {
    expect(modeFromPath('/demo')).toBe('demo')
    expect(modeFromPath('/demo/courses')).toBe('demo')
    expect(modeFromPath('/demonstration')).toBe('real')
    expect(modeFromPath('/courses')).toBe('real')
  })
})

describe('stripMode', () => {
  it('removes the demo prefix and leaves real paths alone', () => {
    expect(stripMode('/demo/admin/users')).toBe('/admin/users')
    expect(stripMode('/demo')).toBe('/')
    expect(stripMode('/admin/users')).toBe('/admin/users')
  })
})

describe('pathFor', () => {
  it('prefixes app paths for the demo tree', () => {
    expect(pathFor('demo', '/courses')).toBe('/demo/courses')
    expect(pathFor('demo', '/')).toBe('/demo')
    expect(pathFor('real', '/courses')).toBe('/courses')
  })

  it('does not double-prefix a path that already carries the demo prefix', () => {
    expect(pathFor('demo', '/demo/courses')).toBe('/demo/courses')
    expect(pathFor('real', '/demo/courses')).toBe('/courses')
  })

  it('refuses relative paths', () => {
    expect(() => pathFor('demo', 'courses')).toThrow()
  })
})
