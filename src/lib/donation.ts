export type EquivalenceTier = {
  amountReais: number
  tokens: number
  monthlyScholarships: number
}

/**
 * Seção 4.4 da doc técnica UAIFAI-Esqueleto: "tabela de equivalência
 * sugerida, a definir com a USP". Pacotes fixos, não fórmula: tokens
 * escalam linearmente com o valor (5 tokens/real nos três níveis), mas
 * bolsas mensais não (150 tokens/bolsa no primeiro nível, 125 nos outros
 * dois) — por isso é uma tabela, e valores fora dela não têm resposta.
 */
export const EQUIVALENCE_TABLE: readonly EquivalenceTier[] = [
  { amountReais: 30, tokens: 150, monthlyScholarships: 1 },
  { amountReais: 100, tokens: 500, monthlyScholarships: 4 },
  { amountReais: 300, tokens: 1500, monthlyScholarships: 12 },
]

export function tierForAmount(amountReais: number): EquivalenceTier | undefined {
  return EQUIVALENCE_TABLE.find((tier) => tier.amountReais === amountReais)
}

export type PaymentMethod = 'pix' | 'boleto'

export type PaymentGateway = {
  charge(amountReais: number, method: PaymentMethod): Promise<{ confirmed: boolean }>
}

/** Ponto de troca: hoje resolve local, depois chama o gateway real (seção 7 da doc técnica). */
export const mockPaymentGateway: PaymentGateway = {
  async charge() {
    return { confirmed: true }
  },
}
