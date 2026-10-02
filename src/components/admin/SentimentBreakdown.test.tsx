import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SentimentBreakdown } from './SentimentBreakdown'

describe('SentimentBreakdown', () => {
  it('states each share as text, not only as bar length', () => {
    render(
      <SentimentBreakdown
        shares={{ positive: 73, neutral: 23, negative: 4 }}
        counts={{ positive: 412, neutral: 131, negative: 19 }}
      />,
    )
    expect(screen.getByText('Positivas')).toBeInTheDocument()
    expect(screen.getByText('73% · 412 mensagens')).toBeInTheDocument()
    expect(screen.getByText('4% · 19 mensagens')).toBeInTheDocument()
  })
})
