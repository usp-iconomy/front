import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DonationFlow } from './DonationFlow'

describe('DonationFlow', () => {
  it('blocks payment until a tier is selected', () => {
    render(<DonationFlow />)
    expect(screen.getByRole('button', { name: /confirmar doação/i })).toBeDisabled()
  })

  it('confirms a donation after picking a tier and paying', async () => {
    const user = userEvent.setup()
    render(<DonationFlow />)

    await user.click(screen.getByRole('button', { name: /r\$ 100/i }))
    await user.click(screen.getByRole('button', { name: /confirmar doação/i }))

    expect(await screen.findByText(/doação confirmada/i)).toBeInTheDocument()
  })
})
