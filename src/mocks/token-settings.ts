import type { CommunityRateOverride, TokenRateSettings } from '@/types/domain'

export const tokenRateSettings: TokenRateSettings = { incrementMultiplier: 1, weeklyDecayPercent: 10 }

export const communityRateOverrides: readonly CommunityRateOverride[] = [
  { communityId: 'kalunga', weeklyDecayPercent: 4 },
  { communityId: 'ivaporunduva', weeklyDecayPercent: 5 },
]
