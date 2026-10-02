import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const realTree = __dirname
const sources = readdirSync(realTree, { recursive: true, encoding: 'utf8' })
  .filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\.(ts|tsx)$/.test(file))

describe('the real tree', () => {
  it('has source files to check', () => {
    expect(sources.length).toBeGreaterThan(10)
  })

  it.each(sources)('never imports mock or demo data in %s', (file) => {
    const source = readFileSync(path.join(realTree, file), 'utf8')

    expect(source).not.toMatch(/from ['"]@\/mocks/)
    expect(source).not.toMatch(/from ['"]@\/data\/demo/)
    expect(source).not.toMatch(/import\(['"]@\/(mocks|data\/demo)/)
  })
})
