'use client'

import Link from 'next/link'
import { Avatar, Icon, Menu, MenuItem, MenuSeparator, type IconName } from '@/design-system'
import styles from './AccountMenu.module.css'

export type AccountDestination = {
  href: string
  label: string
  /** What the destination holds, so the switch reads as a place, not a mode. */
  description: string
  icon: IconName
}

export type AccountMenuProps = {
  name: string
  roleLabel: string
  links?: readonly AccountDestination[]
  /** The other interface this account can use. Absent for accounts with only one. */
  switchTo?: AccountDestination
  /** Real mode: ends the session. Rendered as the menu's last item. */
  signOut?: () => void | Promise<void>
  /** Demo mode: where "Sair da demonstração" leads. */
  exitDemoHref?: string
  /** Shows name and role inside the trigger, for the admin sidebar. */
  showIdentity?: boolean
  side?: 'top' | 'bottom'
  align?: 'start' | 'end'
}

function Destination({ destination }: { destination: AccountDestination }) {
  return (
    <MenuItem>
      <Link href={destination.href}>
        <Icon name={destination.icon} size={18} />
        <span className={styles.itemText}>
          <span className={styles.itemLabel}>{destination.label}</span>
          <span className={styles.itemDescription}>{destination.description}</span>
        </span>
      </Link>
    </MenuItem>
  )
}

export function AccountMenu({
  name,
  roleLabel,
  links = [],
  switchTo,
  signOut,
  exitDemoHref,
  showIdentity = false,
  side,
  align,
}: AccountMenuProps) {
  const trigger = (
    <button
      type="button"
      aria-label={`Menu da conta: ${name}`}
      className={`${styles.trigger} ${showIdentity ? styles.withIdentity : ''}`.trim()}
    >
      <Avatar name={name} size={showIdentity ? 'sm' : 'md'} />
      {showIdentity && (
        <span className={styles.identity}>
          <span className={styles.name}>{name}</span>
          <span className={styles.role}>{roleLabel}</span>
        </span>
      )}
      <Icon name="chevronDown" size={14} />
    </button>
  )

  return (
    <Menu
      trigger={trigger}
      side={side}
      align={align}
      header={
        <>
          <p className={styles.headerName}>{name}</p>
          <p className={styles.headerRole}>{roleLabel}</p>
        </>
      }
    >
      {links.map((destination) => (
        <Destination key={destination.href} destination={destination} />
      ))}
      {switchTo && (
        <>
          {links.length > 0 && <MenuSeparator />}
          <Destination destination={switchTo} />
        </>
      )}
      {(signOut || exitDemoHref) && (links.length > 0 || switchTo) && <MenuSeparator />}
      {signOut && (
        <form action={signOut}>
          {/* The form lives inside the menu: closing it on select would detach the form before it submits. */}
          <MenuItem onSelect={(event) => event.preventDefault()}>
            <button type="submit" className={styles.exitButton}>
              <span className={styles.itemLabel}>Sair</span>
            </button>
          </MenuItem>
        </form>
      )}
      {exitDemoHref && (
        <MenuItem>
          <Link href={exitDemoHref}>
            <span className={styles.itemLabel}>Sair da demonstração</span>
          </Link>
        </MenuItem>
      )}
    </Menu>
  )
}
