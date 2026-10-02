'use client'

import { AlertDialog } from 'radix-ui'
import type { ReactNode } from 'react'
import { Button } from '../Button/Button'
import styles from './ConfirmDialog.module.css'

export type ConfirmDialogProps = {
  open: boolean
  /** Phrase it as the question being decided, e.g. "Alterar as taxas padrão?". */
  title: string
  /** What changes. Announced as the dialog's description. */
  children: ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** Opens with focus on cancel. Confirm is a plain button so closing never fires onCancel after onConfirm. */
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.overlay} />
        <AlertDialog.Content className={styles.content}>
          <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className={styles.body}>{children}</div>
          </AlertDialog.Description>
          <div className={styles.actions}>
            <AlertDialog.Cancel asChild>
              <Button variant="ghost">{cancelLabel}</Button>
            </AlertDialog.Cancel>
            <Button onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
