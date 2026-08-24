'use client'

import { useState, type FormEvent } from 'react'
import { Button, Chip, FlowStep } from '@/design-system'
import { EQUIVALENCE_TABLE, mockPaymentGateway, type PaymentMethod } from '@/lib/donation'
import type { BeneficiaryCommunity } from '@/types/domain'
import styles from './DonationFlow.module.css'

const communities: readonly BeneficiaryCommunity[] = ['quilombola', 'peripheral', 'student']

const communityLabel: Record<BeneficiaryCommunity, string> = {
  quilombola: 'Comunidade quilombola',
  peripheral: 'Periferia urbana',
  student: 'Coletivo estudantil',
}

type Result = { kind: 'success' | 'error'; message: string }

export function DonationFlow() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [community, setCommunity] = useState<BeneficiaryCommunity>('quilombola')
  const [paying, setPaying] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const tier = EQUIVALENCE_TABLE.find((candidate) => candidate.amountReais === selectedAmount) ?? null
  const confirmed = result?.kind === 'success'

  async function handlePay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const raw = new FormData(event.currentTarget).get('method')
    const method: PaymentMethod | null = raw === 'pix' || raw === 'boleto' ? raw : null

    if (!tier || !method) {
      setResult({ kind: 'error', message: 'Escolha um valor e uma forma de pagamento.' })
      return
    }

    setPaying(true)
    const { confirmed: gatewayConfirmed } = await mockPaymentGateway.charge(tier.amountReais, method)
    setPaying(false)

    setResult(
      gatewayConfirmed
        ? {
            kind: 'success',
            message: `Doação confirmada. ${tier.monthlyScholarships} bolsa(s) mensal(is) geradas para ${communityLabel[community]}.`,
          }
        : { kind: 'error', message: 'Pagamento não confirmado. Tente novamente.' },
    )
  }

  return (
    <div>
      <FlowStep
        step={1}
        title="Escolha o valor e a comunidade"
        description="Cada nível de doação equivale a um número fixo de tokens e bolsas mensais."
        status={tier ? 'done' : 'current'}
      >
        <ul className={styles.tiers} aria-label="Valor da doação">
          {EQUIVALENCE_TABLE.map((candidate) => (
            <li key={candidate.amountReais}>
              <Chip
                active={selectedAmount === candidate.amountReais}
                onClick={() => setSelectedAmount(candidate.amountReais)}
              >
                R$ {candidate.amountReais} · {candidate.tokens} tokens · {candidate.monthlyScholarships} bolsa(s)
              </Chip>
            </li>
          ))}
        </ul>

        <label htmlFor="donation-community" className={styles.label}>
          Comunidade beneficiária
        </label>
        <select
          id="donation-community"
          className={styles.select}
          value={community}
          onChange={(event) => setCommunity(event.target.value as BeneficiaryCommunity)}
        >
          {communities.map((key) => (
            <option key={key} value={key}>
              {communityLabel[key]}
            </option>
          ))}
        </select>
      </FlowStep>

      <FlowStep
        step={2}
        title="Pagamento"
        description="PIX ou boleto — a confirmação libera os Distribution Codes para a comunidade escolhida."
        status={confirmed ? 'done' : tier ? 'current' : 'pending'}
      >
        <form onSubmit={handlePay} className={styles.paymentForm}>
          <label>
            <input type="radio" name="method" value="pix" defaultChecked />
            PIX
          </label>
          <label>
            <input type="radio" name="method" value="boleto" />
            Boleto
          </label>
          <Button type="submit" disabled={!tier || paying}>
            {paying ? 'Processando' : 'Confirmar doação'}
          </Button>
        </form>
        <p role="status" className={`${styles.feedback} ${result ? styles[result.kind] : ''}`.trim()}>
          {result?.message}
        </p>
      </FlowStep>

      <FlowStep
        step={3}
        title="Confirmação"
        description="Você recebe o número de Distribution Codes gerados e pode acompanhar o impacto a qualquer momento em /donate/history."
        status={confirmed ? 'done' : 'pending'}
      />
    </div>
  )
}
