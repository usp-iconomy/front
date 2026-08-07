const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const monthFormat = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' })

const numberFormat = new Intl.NumberFormat('pt-BR')

/** UTC instant to a compact local date: `05 de ago. de 2026` → `05/ago/2026`. */
export function formatDate(utcIso: string): string {
  return dateFormat.format(new Date(utcIso)).replace(/\s*de\s*/g, '/').replace(/\./g, '')
}

/** UTC instant to month and year, for certificate issuance dates. */
export function formatMonth(utcIso: string): string {
  return monthFormat.format(new Date(utcIso))
}

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * Compact pt-BR elapsed time. Rendered inside a `<time>` with
 * `suppressHydrationWarning`, since server and client evaluate `now`
 * milliseconds apart.
 */
export function formatElapsed(utcIso: string, now: number = Date.now()): string {
  const elapsed = Math.max(0, now - new Date(utcIso).getTime())

  if (elapsed < HOUR) return `há ${Math.max(1, Math.floor(elapsed / MINUTE))} min`
  if (elapsed < DAY) return `há ${Math.floor(elapsed / HOUR)}h`

  const days = Math.floor(elapsed / DAY)
  return days === 1 ? 'há 1 dia' : `há ${days} dias`
}
