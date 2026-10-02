'use client'

import { useId, useState, type FormEvent } from 'react'
import { Button, ConfirmDialog, Input, SectionHeader, TOKEN_SYMBOL } from '@/design-system'
import { formatNumber } from '@/lib/format'
import {
  projectDecay,
  senderIncrement,
  validateDefaultRates,
  validateOverride,
  type RateErrors,
} from '@/lib/token-rates'
import type { AdminScope, CommunityRateOverride, QuilombolaCommunity, TokenRateSettings } from '@/types/domain'
import styles from './TokenSettingsPanel.module.css'

/** Fixed example, so before and after numbers compare at a glance. */
const EXAMPLE_IDLE_BALANCE = 100
const EXAMPLE_WEEKS = 4
const EXAMPLE_SENT = 50
const EXAMPLE_SENDER_BALANCE = 200

function decayLine(percent: number): string {
  const remaining = Math.floor(projectDecay(EXAMPLE_IDLE_BALANCE, percent, EXAMPLE_WEEKS))
  return `${formatNumber(percent)}% por semana; ${TOKEN_SYMBOL} ${EXAMPLE_IDLE_BALANCE} parados viram ${TOKEN_SYMBOL} ${formatNumber(remaining)} em ${EXAMPLE_WEEKS} semanas`
}

function incrementLine(multiplier: number): string {
  const increment = senderIncrement(EXAMPLE_SENT, EXAMPLE_SENDER_BALANCE, multiplier)
  return `multiplicador ${formatNumber(multiplier)}; enviar ${TOKEN_SYMBOL} ${EXAMPLE_SENT} de um saldo de ${TOKEN_SYMBOL} ${EXAMPLE_SENDER_BALANCE} devolve ${TOKEN_SYMBOL} ${formatNumber(increment)}`
}

type Pending =
  | { kind: 'default'; value: TokenRateSettings }
  | { kind: 'override'; communityId: string; value: number }

export type TokenSettingsPanelProps = {
  scope: AdminScope
  initialSettings: TokenRateSettings
  initialOverrides: readonly CommunityRateOverride[]
  communities: readonly Pick<QuilombolaCommunity, 'id' | 'name'>[]
}

export function TokenSettingsPanel({ scope, initialSettings, initialOverrides, communities }: TokenSettingsPanelProps) {
  const id = useId()
  const [settings, setSettings] = useState(initialSettings)
  const [overrides, setOverrides] = useState(initialOverrides)
  const [draft, setDraft] = useState({
    incrementMultiplier: formatNumber(initialSettings.incrementMultiplier),
    weeklyDecayPercent: formatNumber(initialSettings.weeklyDecayPercent),
  })
  const [overrideDrafts, setOverrideDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialOverrides.map((override) => [override.communityId, formatNumber(override.weeklyDecayPercent)])),
  )
  const [defaultErrors, setDefaultErrors] = useState<RateErrors>({})
  const [overrideErrors, setOverrideErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState<Pending | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const communityName = (communityId: string) =>
    communities.find((community) => community.id === communityId)?.name ?? communityId
  const visibleOverrides =
    scope.kind === 'usp' ? overrides : overrides.filter((override) => override.communityId === scope.communityId)

  function reviewDefault(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateDefaultRates(draft, overrides, communityName)
    if (!result.ok) {
      setDefaultErrors(result.errors)
      return
    }
    setDefaultErrors({})
    setPending({ kind: 'default', value: result.value })
  }

  function reviewOverride(communityId: string) {
    const result = validateOverride(overrideDrafts[communityId] ?? '', settings.weeklyDecayPercent)
    if (!result.ok) {
      setOverrideErrors((current) => ({ ...current, [communityId]: result.error }))
      return
    }
    setOverrideErrors((current) => {
      const next = { ...current }
      delete next[communityId]
      return next
    })
    setPending({ kind: 'override', communityId, value: result.value })
  }

  function confirm() {
    if (!pending) return
    if (pending.kind === 'default') {
      setSettings(pending.value)
      setAnnouncement('Taxas padrão atualizadas.')
    } else {
      setOverrides((current) =>
        current.map((override) =>
          override.communityId === pending.communityId ? { ...override, weeklyDecayPercent: pending.value } : override,
        ),
      )
      setAnnouncement(`Taxa de ${communityName(pending.communityId)} atualizada.`)
    }
    setPending(null)
  }

  const currentOverride = (communityId: string) =>
    overrides.find((override) => override.communityId === communityId)?.weeklyDecayPercent ?? 0

  return (
    <div>
      <p role="status" className={styles.announcement}>
        {announcement}
      </p>

      <SectionHeader title="Taxas padrão da comunidade USP" />
      {scope.kind === 'usp' ? (
        <form onSubmit={reviewDefault} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor={`${id}-increment`} className={styles.label}>
              Multiplicador do incremento
            </label>
            <Input
              id={`${id}-increment`}
              inputMode="decimal"
              value={draft.incrementMultiplier}
              aria-invalid={Boolean(defaultErrors.incrementMultiplier)}
              aria-describedby={`${id}-increment-hint ${id}-increment-error`}
              onChange={(event) => setDraft((current) => ({ ...current, incrementMultiplier: event.target.value }))}
            />
            <p id={`${id}-increment-hint`} className={styles.hint}>
              1 aplica a fórmula do ARIGATO CREATION como está: enviado × (enviado ÷ saldo).
            </p>
            <p id={`${id}-increment-error`} className={styles.error}>
              {defaultErrors.incrementMultiplier}
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${id}-decay`} className={styles.label}>
              Decaimento semanal (%)
            </label>
            <Input
              id={`${id}-decay`}
              inputMode="decimal"
              value={draft.weeklyDecayPercent}
              aria-invalid={Boolean(defaultErrors.weeklyDecayPercent)}
              aria-describedby={`${id}-decay-hint ${id}-decay-error`}
              onChange={(event) => setDraft((current) => ({ ...current, weeklyDecayPercent: event.target.value }))}
            />
            <p id={`${id}-decay-hint`} className={styles.hint}>
              Quanto um saldo parado perde por semana. O saldo nunca fica negativo.
            </p>
            <p id={`${id}-decay-error`} className={styles.error}>
              {defaultErrors.weeklyDecayPercent}
            </p>
          </div>

          <Button type="submit" variant="secondary" disabled={pending !== null}>
            Revisar alteração
          </Button>
        </form>
      ) : (
        <p className={styles.readOnly}>
          {`Multiplicador ${formatNumber(settings.incrementMultiplier)} e decaimento de ${formatNumber(settings.weeklyDecayPercent)}% por semana. Só a administração USP altera estas taxas.`}
        </p>
      )}

      <SectionHeader title="Taxa reduzida das comunidades quilombolas" />
      <p className={styles.hint}>
        Saldo parado em comunidade quilombola perde menos por semana que o padrão, para não penalizar quem acessa a plataforma com menos frequência.
      </p>
      <ul className={styles.overrides}>
        {visibleOverrides.map((override) => {
          const inputId = `${id}-override-${override.communityId}`
          const error = overrideErrors[override.communityId]
          return (
            <li key={override.communityId} className={styles.field}>
              <label htmlFor={inputId} className={styles.label}>
                {communityName(override.communityId)} (% por semana)
              </label>
              <div className={styles.inline}>
                <Input
                  id={inputId}
                  inputMode="decimal"
                  className={styles.narrow}
                  value={overrideDrafts[override.communityId] ?? ''}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${inputId}-error`}
                  onChange={(event) =>
                    setOverrideDrafts((current) => ({ ...current, [override.communityId]: event.target.value }))
                  }
                />
                <Button
                  variant="secondary"
                  disabled={pending !== null}
                  aria-label={`Revisar taxa de ${communityName(override.communityId)}`}
                  onClick={() => reviewOverride(override.communityId)}
                >
                  Revisar
                </Button>
              </div>
              <p id={`${inputId}-error`} className={styles.error}>
                {error}
              </p>
            </li>
          )
        })}
      </ul>

      <ConfirmDialog
        open={pending !== null}
        title={
          pending?.kind === 'override'
            ? `Alterar a taxa de ${communityName(pending.communityId)}?`
            : 'Alterar as taxas padrão?'
        }
        confirmLabel={pending?.kind === 'override' ? 'Alterar taxa' : 'Alterar taxas'}
        cancelLabel="Manter como está"
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      >
        {pending && (
          <>
            <ul className={styles.diff}>
              {pending.kind === 'default' ? (
                <>
                  <li>Incremento hoje: {incrementLine(settings.incrementMultiplier)}.</li>
                  <li>Incremento depois: {incrementLine(pending.value.incrementMultiplier)}.</li>
                  <li>Decaimento hoje: {decayLine(settings.weeklyDecayPercent)}.</li>
                  <li>Decaimento depois: {decayLine(pending.value.weeklyDecayPercent)}.</li>
                </>
              ) : (
                <>
                  <li>Hoje: {decayLine(currentOverride(pending.communityId))}.</li>
                  <li>Depois: {decayLine(pending.value)}.</li>
                </>
              )}
            </ul>
            <p className={styles.hint}>
              {pending.kind === 'default'
                ? 'A mudança vale para todos os saldos da comunidade USP.'
                : `A mudança vale para todos os saldos de ${communityName(pending.communityId)}.`}
            </p>
          </>
        )}
      </ConfirmDialog>
    </div>
  )
}
