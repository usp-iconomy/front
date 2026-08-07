import styles from './TokenAmount.module.css'

/** Peace Coin symbol (U+262E), per the platform's brand attributes. */
export const TOKEN_SYMBOL = '☮'

export type TokenAmountProps = {
  value: number
  /** `incoming` prefixes +, `outgoing` prefixes −. `neutral` shows the raw value. */
  direction?: 'incoming' | 'outgoing' | 'neutral'
  /** Appends the token name, e.g. `☮ 450 UAIFAI`. */
  showUnit?: boolean
}

const numberFormat = new Intl.NumberFormat('pt-BR')

export function TokenAmount({ value, direction = 'neutral', showUnit = false }: TokenAmountProps) {
  const sign = direction === 'incoming' ? '+' : direction === 'outgoing' ? '−' : ''
  const toneClass = direction === 'incoming' ? styles.incoming : direction === 'outgoing' ? styles.outgoing : ''

  return (
    <span className={`${styles.amount} ${toneClass}`.trim()}>
      <span className={styles.symbol} aria-hidden="true">
        {TOKEN_SYMBOL}
      </span>
      {sign}
      {numberFormat.format(Math.abs(value))}
      {showUnit && ' UAIFAI'}
    </span>
  )
}
