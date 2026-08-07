import styles from './Avatar.module.css'

export type AvatarSize = 'sm' | 'md' | 'lg'

export type AvatarProps = {
  /** Full name. Initials are derived from it; the name itself labels the avatar. */
  name: string
  size?: AvatarSize
  /** Number of initials to show. */
  initialsCount?: 1 | 2
}

function initialsOf(name: string, count: 1 | 2): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts
    .slice(0, count)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function Avatar({ name, size = 'md', initialsCount = 2 }: AvatarProps) {
  return (
    <span className={`${styles.avatar} ${styles[size]}`} role="img" aria-label={name}>
      {initialsOf(name, initialsCount)}
    </span>
  )
}
