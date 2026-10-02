import { describe, expect, it } from 'vitest'
import type { MemberCirculation } from '@/types/domain'
import { rankCourses, sentimentShares, topContributors, unpaidDegrees, velocity, velocityCaption } from './community-analysis'

const members: readonly MemberCirculation[] = [
  { memberId: 'a', name: 'Ana', balance: 800, sent: 20 },
  { memberId: 'b', name: 'Bruno', balance: 300, sent: 120 },
  { memberId: 'c', name: 'Caio', balance: 0, sent: 0 },
  { memberId: 'd', name: 'Dora', balance: 1200, sent: 0 },
]

describe('velocity', () => {
  it('divides tokens circulated by total supply', () => {
    expect(velocity(4200, 2000)).toBe(2.1)
  })

  it('is zero before any supply exists', () => {
    expect(velocity(100, 0)).toBe(0)
  })
})

describe('sentimentShares', () => {
  it('rounds to whole percentages that add up to 100', () => {
    expect(sentimentShares({ positive: 1, neutral: 1, negative: 1 })).toEqual({
      positive: 34,
      neutral: 33,
      negative: 33,
    })
  })

  it('gives the leftover point to the largest remainder', () => {
    const shares = sentimentShares({ positive: 412, neutral: 131, negative: 19 })
    expect(shares.positive + shares.neutral + shares.negative).toBe(100)
    expect(shares).toEqual({ positive: 73, neutral: 23, negative: 4 })
  })

  it('returns zeros when no message was classified', () => {
    expect(sentimentShares({ positive: 0, neutral: 0, negative: 0 })).toEqual({
      positive: 0,
      neutral: 0,
      negative: 0,
    })
  })
})

describe('unpaidDegrees', () => {
  it('flags members who hold tokens but barely sent any, largest balance first', () => {
    expect(unpaidDegrees(members).map((member) => member.memberId)).toEqual(['d', 'a'])
  })

  it('leaves a member exactly at the threshold out', () => {
    expect(unpaidDegrees([{ memberId: 'e', name: 'Eva', balance: 100, sent: 10 }])).toEqual([])
  })
})

describe('topContributors', () => {
  it('orders by tokens sent and skips members who sent nothing', () => {
    expect(topContributors(members).map((member) => member.memberId)).toEqual(['b', 'a'])
  })

  it('respects the limit', () => {
    expect(topContributors(members, 1)).toHaveLength(1)
  })
})

describe('rankCourses', () => {
  it('orders courses by tokens circulated', () => {
    const ranked = rankCourses([
      { courseId: 'x', title: 'X', tokensCirculated: 10 },
      { courseId: 'y', title: 'Y', tokensCirculated: 90 },
    ])
    expect(ranked.map((course) => course.courseId)).toEqual(['y', 'x'])
  })
})

describe('velocityCaption', () => {
  it('names above, at and below the target of 2', () => {
    expect(velocityCaption(2.1)).toBe('Acima da meta de 2')
    expect(velocityCaption(2)).toBe('Na meta de 2')
    expect(velocityCaption(1.9)).toBe('Abaixo da meta de 2')
  })
})
