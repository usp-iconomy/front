'use client'

import { DropdownMenu } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'
import styles from './Menu.module.css'

export type MenuProps = {
  /** A single focusable element, usually a button. */
  trigger: ReactElement
  /** Non-interactive heading above the items, e.g. who is signed in. */
  header?: ReactNode
  side?: 'top' | 'bottom'
  align?: 'start' | 'end'
  children: ReactNode
}

export function Menu({ trigger, header, side = 'bottom', align = 'end', children }: MenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.content} side={side} align={align} sideOffset={8} collisionPadding={16}>
          {header && <div className={styles.header}>{header}</div>}
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

/** Turns a link or button into a keyboard-navigable menu item. */
export function MenuItem({
  children,
  onSelect,
}: {
  children: ReactElement
  /** Calling `event.preventDefault()` keeps the menu open after the item is chosen. */
  onSelect?: (event: Event) => void
}) {
  return (
    <DropdownMenu.Item asChild className={styles.item} onSelect={onSelect}>
      {children}
    </DropdownMenu.Item>
  )
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className={styles.separator} />
}
