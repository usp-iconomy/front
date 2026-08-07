import type { ButtonHTMLAttributes } from 'react'
import styles from './Chip.module.css'

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> & {
  active?: boolean
}

export function Chip({ active = false, className, ...props }: ChipProps) {
  const classes = [styles.chip, active && styles.active, className].filter(Boolean).join(' ')
  return <button type="button" aria-pressed={active} className={classes} {...props} />
}
