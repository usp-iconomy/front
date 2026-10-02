import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import RealTreeError from './error'

describe('real tree error boundary', () => {
  it('says the server is unreachable and retries on request', async () => {
    const retry = vi.fn()
    render(<RealTreeError error={new Error('boom')} retry={retry} />)

    expect(screen.getByRole('heading', { name: 'Não conseguimos falar com o servidor agora.' })).toBeInTheDocument()
    expect(screen.getByText('Seus dados estão salvos. Tente de novo em instantes.')).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(retry).toHaveBeenCalledTimes(1)
  })
})
