import type { ElementType, HTMLAttributes } from 'react'
import styles from './Card.module.css'

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  /** Adds the lift-on-hover affordance. Only for cards that lead somewhere. */
  interactive?: boolean
}

export function Card({ as: Tag = 'div', interactive = false, className, ...props }: CardProps) {
  const classes = [styles.card, interactive && styles.interactive, className].filter(Boolean).join(' ')
  return <Tag className={classes} {...props} />
}
