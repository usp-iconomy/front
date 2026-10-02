/** Excel and Sheets run cells starting with these as formulas. */
const FORMULA_PREFIX = /^[=+\-@\t\r]/
const PLAIN_NUMBER = /^-?\d+([.,]\d+)?$/

function escapeCell(value: string): string {
  const safe = FORMULA_PREFIX.test(value) && !PLAIN_NUMBER.test(value) ? `'${value}` : value
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

/** RFC 4180, CRLF line endings. */
export function toCsv(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map(escapeCell).join(',')).join('\r\n')
}
