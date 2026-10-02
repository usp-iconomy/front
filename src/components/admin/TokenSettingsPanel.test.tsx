import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { CommunityRateOverride, TokenRateSettings } from '@/types/domain'
import { TokenSettingsPanel } from './TokenSettingsPanel'

const settings: TokenRateSettings = { incrementMultiplier: 1, weeklyDecayPercent: 10 }
const overrides: readonly CommunityRateOverride[] = [
  { communityId: 'kalunga', weeklyDecayPercent: 4 },
  { communityId: 'ivaporunduva', weeklyDecayPercent: 5 },
]
const communities = [
  { id: 'kalunga', name: 'Quilombo Kalunga' },
  { id: 'ivaporunduva', name: 'Quilombo Ivaporunduva' },
]

function renderPanel(scope: Parameters<typeof TokenSettingsPanel>[0]['scope']) {
  return render(
    <TokenSettingsPanel scope={scope} initialSettings={settings} initialOverrides={overrides} communities={communities} />,
  )
}

describe('TokenSettingsPanel', () => {
  it('refuses a default decay at or below a community rate', async () => {
    const user = userEvent.setup()
    renderPanel({ kind: 'usp' })

    const decay = screen.getByLabelText(/decaimento semanal/i)
    await user.clear(decay)
    await user.type(decay, '5')
    await user.click(screen.getByRole('button', { name: /revisar alteração/i }))

    expect(screen.getByText(/acima da taxa de Quilombo Ivaporunduva/i)).toBeInTheDocument()
    expect(decay).toHaveFocus()
    expect(screen.queryByRole('heading', { name: /alterar as taxas padrão/i })).not.toBeInTheDocument()
  })

  it('applies a default change only after the review step', async () => {
    const user = userEvent.setup()
    renderPanel({ kind: 'usp' })

    const decay = screen.getByLabelText(/decaimento semanal/i)
    await user.clear(decay)
    await user.type(decay, '12')
    await user.click(screen.getByRole('button', { name: /revisar alteração/i }))

    expect(screen.getByRole('heading', { name: 'Alterar as taxas padrão?' })).toBeInTheDocument()
    expect(screen.getByText(/depois: 12% por semana/i)).toBeInTheDocument()
    expect(screen.queryByText('Taxas padrão atualizadas.')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Alterar taxas' }))
    expect(screen.getByText('Taxas padrão atualizadas.')).toBeInTheDocument()
  })

  it('gives a quilombola admin only their own community rate', () => {
    renderPanel({ kind: 'quilombola', communityId: 'kalunga' })
    expect(screen.queryByLabelText(/decaimento semanal/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText('Quilombo Kalunga (% por semana)')).toBeInTheDocument()
    expect(screen.queryByLabelText('Quilombo Ivaporunduva (% por semana)')).not.toBeInTheDocument()
  })

  it('refuses a community rate equal to the default', async () => {
    const user = userEvent.setup()
    renderPanel({ kind: 'quilombola', communityId: 'kalunga' })

    const rate = screen.getByLabelText('Quilombo Kalunga (% por semana)')
    await user.clear(rate)
    await user.type(rate, '10')
    await user.click(screen.getByRole('button', { name: 'Revisar taxa de Quilombo Kalunga' }))

    expect(screen.getByText(/menor que a padrão/i)).toBeInTheDocument()
    expect(rate).toHaveFocus()
  })

  it('drops the change when the review is cancelled', async () => {
    const user = userEvent.setup()
    renderPanel({ kind: 'usp' })

    const decay = screen.getByLabelText(/decaimento semanal/i)
    await user.clear(decay)
    await user.type(decay, '12')
    await user.click(screen.getByRole('button', { name: /revisar alteração/i }))
    await user.click(screen.getByRole('button', { name: 'Manter como está' }))

    expect(screen.queryByRole('heading', { name: 'Alterar as taxas padrão?' })).not.toBeInTheDocument()
    expect(screen.queryByText('Taxas padrão atualizadas.')).toBeNull()
  })

  it('applies a community rate after the review step', async () => {
    const user = userEvent.setup()
    renderPanel({ kind: 'quilombola', communityId: 'kalunga' })

    const rate = screen.getByLabelText('Quilombo Kalunga (% por semana)')
    await user.clear(rate)
    await user.type(rate, '3')
    await user.click(screen.getByRole('button', { name: 'Revisar taxa de Quilombo Kalunga' }))
    await user.click(screen.getByRole('button', { name: 'Alterar taxa' }))

    expect(screen.getByText('Taxa de Quilombo Kalunga atualizada.')).toBeInTheDocument()
  })
})
