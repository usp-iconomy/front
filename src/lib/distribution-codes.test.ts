import { describe, expect, it } from 'vitest'
import type { DistributionCode } from '@/types/domain'
import {
  CODE_LENGTH,
  codeStatus,
  distributionCodesCsv,
  generateCode,
  localDayBoundaryUtc,
  validateDraft,
  type DistributionCodeDraft,
} from './distribution-codes'

const code: DistributionCode = {
  code: 'KLG7M2Q9',
  name: 'Quilombo Kalunga, turma 1',
  tokensPerRedemption: 200,
  maxRedemptions: 40,
  redemptionsUsed: 31,
  validFrom: '2026-09-01T03:00:00.000Z',
  validUntil: '2026-12-31T02:59:59.999Z',
}

const now = Date.parse('2026-10-02T12:00:00Z')

describe('codeStatus', () => {
  it('is active inside the window with redemptions left', () => {
    expect(codeStatus(code, now)).toBe('active')
  })

  it('is scheduled before the window opens', () => {
    expect(codeStatus(code, Date.parse('2026-08-31T12:00:00Z'))).toBe('scheduled')
  })

  it('is expired after the window closes, even with redemptions left (RN-06)', () => {
    expect(codeStatus(code, Date.parse('2026-12-31T03:00:00Z'))).toBe('expired')
  })

  it('is exhausted when every redemption was used', () => {
    expect(codeStatus({ ...code, redemptionsUsed: 40 }, now)).toBe('exhausted')
  })
})

describe('localDayBoundaryUtc', () => {
  it('reads the date in the local zone', () => {
    expect(localDayBoundaryUtc('2026-10-01', 'start')).toBe(new Date(2026, 9, 1, 0, 0, 0, 0).toISOString())
    expect(localDayBoundaryUtc('2026-10-01', 'end')).toBe(new Date(2026, 9, 1, 23, 59, 59, 999).toISOString())
  })

  it('rejects impossible or malformed dates', () => {
    expect(localDayBoundaryUtc('2026-02-31', 'start')).toBeNull()
    expect(localDayBoundaryUtc('01/10/2026', 'start')).toBeNull()
    expect(localDayBoundaryUtc('', 'start')).toBeNull()
  })
})

const validDraft: DistributionCodeDraft = {
  name: '  Periferia Leste  ',
  tokensPerRedemption: '150',
  maxRedemptions: '60',
  validFrom: '2026-10-02',
  validUntil: '2026-10-02',
  courseId: '',
}

/** Noon UTC the day before the drafts start: still "before" in every zone from UTC-12 to UTC+14. */
const draftNow = Date.parse('2026-10-01T12:00:00Z')

describe('validateDraft', () => {
  it('accepts a code valid for a single local day', () => {
    const result = validateDraft(validDraft, draftNow)
    expect(result).toEqual({
      ok: true,
      value: {
        name: 'Periferia Leste',
        tokensPerRedemption: 150,
        maxRedemptions: 60,
        validFrom: new Date(2026, 9, 2, 0, 0, 0, 0).toISOString(),
        validUntil: new Date(2026, 9, 2, 23, 59, 59, 999).toISOString(),
      },
    })
  })

  it('links the course only when one was picked', () => {
    const result = validateDraft({ ...validDraft, courseId: 'design-comunitario' }, draftNow)
    expect(result.ok && result.value.courseId).toBe('design-comunitario')
  })

  it('reports every missing field at once', () => {
    const result = validateDraft(
      { name: ' ', tokensPerRedemption: '0', maxRedemptions: '2.5', validFrom: '', validUntil: '', courseId: '' },
      draftNow,
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && Object.keys(result.errors).sort()).toEqual([
      'maxRedemptions',
      'name',
      'tokensPerRedemption',
      'validFrom',
      'validUntil',
    ])
  })

  it('refuses an end before the start', () => {
    const result = validateDraft({ ...validDraft, validFrom: '2026-10-10', validUntil: '2026-10-05' }, draftNow)
    expect(!result.ok && result.errors.validUntil).toBe('O fim não pode ser antes do início.')
  })

  it('refuses a code that would be born expired', () => {
    const result = validateDraft({ ...validDraft, validFrom: '2026-09-01', validUntil: '2026-09-30' }, draftNow)
    expect(!result.ok && result.errors.validUntil).toMatch(/já passou/)
  })
})

describe('generateCode', () => {
  it('draws only unambiguous characters', () => {
    const generated = generateCode(new Set())
    expect(generated).toHaveLength(CODE_LENGTH)
    expect(generated).toMatch(/^[A-HJ-NP-Z2-9]+$/)
  })

  it('draws again when the code is taken', () => {
    const draws = [...Array<number>(CODE_LENGTH).fill(0), ...Array<number>(CODE_LENGTH).fill(0.999)]
    let index = 0
    const random = () => draws[index++] ?? 0
    expect(generateCode(new Set(['AAAAAAAA']), random)).toBe('99999999')
  })
})

describe('distributionCodesCsv', () => {
  it('writes a header and one row per code with its status', () => {
    const lines = distributionCodesCsv([code], now, () => undefined).split('\r\n')
    expect(lines[0]).toBe(
      'codigo,nome,tokens_por_resgate,resgates_usados,resgates_maximos,valido_de,valido_ate,curso,status',
    )
    expect(lines[1]?.startsWith('KLG7M2Q9,"Quilombo Kalunga, turma 1",200,31,40,')).toBe(true)
    expect(lines[1]?.endsWith(',,Ativo')).toBe(true)
  })
})
