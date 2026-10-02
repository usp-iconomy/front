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

  it('uses the singular for a count of one', () => {
    render(
      <SentimentBreakdown
        shares={{ positive: 50, neutral: 0, negative: 50 }}
        counts={{ positive: 1, neutral: 0, negative: 1 }}
      />,
    )
    expect(screen.getAllByText('50% · 1 mensagem')).toHaveLength(2)
  })
})
