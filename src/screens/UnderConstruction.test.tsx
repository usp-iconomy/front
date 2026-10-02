import { readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UnderConstruction } from './UnderConstruction'

describe('UnderConstruction', () => {
  it('names the area, says it is not wired to the server and links to the same screen in the demo', () => {
    render(<UnderConstruction title="Descobrir cursos" demoPath="/demo/courses" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Descobrir cursos' })).toBeInTheDocument()
    expect(screen.getByText('Esta área ainda não está ligada ao servidor.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver na demonstração' })).toHaveAttribute('href', '/demo/courses')
  })

  it('never reads mock data', () => {
    const source = readFileSync(path.join(__dirname, 'UnderConstruction.tsx'), 'utf8')

    expect(source).not.toMatch(/from ['"]@\/mocks/)
    expect(source).not.toMatch(/from ['"]@\/data\/demo/)
  })
})
