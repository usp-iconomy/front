import { describe, expect, it } from 'vitest'
import { toCsv } from './csv'

describe('toCsv', () => {
  it('joins cells with commas and rows with CRLF', () => {
    expect(
      toCsv([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ).toBe('a,b\r\nc,d')
  })

  it('quotes cells with commas, quotes or line breaks', () => {
    expect(toCsv([['Quilombo, GO', 'diz "oi"', 'linha\nnova']])).toBe('"Quilombo, GO","diz ""oi""","linha\nnova"')
  })

  it('neutralises cells a spreadsheet would run as a formula', () => {
    expect(toCsv([['=HYPERLINK("x")', '@SUM(A1)', '+1+1']])).toBe(`"'=HYPERLINK(""x"")",'@SUM(A1),'+1+1`)
  })

  it('leaves negative numbers numeric', () => {
    expect(toCsv([['-13.83120', '-47.45670', '-5']])).toBe('-13.83120,-47.45670,-5')
  })
})
