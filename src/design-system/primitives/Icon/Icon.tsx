import { icons, type IconName } from './icons'

export type IconProps = {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  /** Give the icon a label only when it carries meaning no nearby text repeats. */
  label?: string
}

export function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.75, label }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={icons[name]} />
    </svg>
  )
}

export type { IconName }
