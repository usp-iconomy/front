import type { WalletSummary } from '@/types/domain'

export type ApiWalletSummary = {
  tokenBalance: number
  circulationCount: number
  soulTokenCount: number
  reputationStars: 1 | 2 | 3 | 4 | 5
  reputationLabel: string
}

export function toWalletSummary(api: ApiWalletSummary): WalletSummary {
  return {
    tokenBalance: api.tokenBalance,
    circulationCount: api.circulationCount,
    soulTokenCount: api.soulTokenCount,
    reputationStars: api.reputationStars,
    reputationLabel: api.reputationLabel,
  }
}
