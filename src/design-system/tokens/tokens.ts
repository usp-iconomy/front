/**
 * Typed mirror of tokens.css, for the cases where a token has to reach
 * JavaScript (inline styles, canvas, chart libraries). Values are `var()`
 * references, so the CSS file stays the single source of truth.
 */

export const color = {
  accent: 'var(--color-accent)',
  accentStrong: 'var(--color-accent-strong)',
  accentHover: 'var(--color-accent-hover)',
  accentLight: 'var(--color-accent-light)',
  accentSoft: 'var(--color-accent-soft)',
  yellow: 'var(--color-yellow)',

  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  surfaceHover: 'var(--color-surface-hover)',
  border: 'var(--color-border)',
  borderAccent: 'var(--color-border-accent)',

  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  textLight: 'var(--color-text-light)',
  textInverse: 'var(--color-text-inverse)',

  positive: 'var(--color-positive)',
  negative: 'var(--color-negative)',
} as const

/** Background/foreground pairs for the four course access types. */
export const tone = {
  open: { bg: 'var(--color-open-bg)', fg: 'var(--color-open-fg)' },
  circulation: { bg: 'var(--color-circulation-bg)', fg: 'var(--color-circulation-fg)' },
  code: { bg: 'var(--color-code-bg)', fg: 'var(--color-code-fg)' },
  sbt: { bg: 'var(--color-sbt-bg)', fg: 'var(--color-sbt-fg)' },
} as const

export const space = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  7: 'var(--space-7)',
  8: 'var(--space-8)',
  9: 'var(--space-9)',
  12: 'var(--space-12)',
} as const

export const radius = {
  xs: 'var(--radius-xs)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  pill: 'var(--radius-pill)',
  circle: 'var(--radius-circle)',
} as const

export const fontSize = {
  '2xs': 'var(--font-size-2xs)',
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-md)',
  base: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
  '5xl': 'var(--font-size-5xl)',
} as const

export const shadow = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  nav: 'var(--shadow-nav)',
  focusRing: 'var(--focus-ring)',
} as const

export type Tone = keyof typeof tone
