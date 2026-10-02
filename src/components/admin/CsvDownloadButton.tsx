'use client'

import { Button } from '@/design-system'

export type CsvDownloadButtonProps = {
  filename: string
  /** A function defers building the file until the click. */
  csv: string | (() => string)
  label: string
}

export function CsvDownloadButton({ filename, csv, label }: CsvDownloadButtonProps) {
  function handleClick() {
    const content = typeof csv === 'function' ? csv() : csv
    // BOM, so Excel opens the accents as UTF-8.
    const blob = new Blob(['\ufeff', content], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <Button variant="secondary" onClick={handleClick}>
      {label}
    </Button>
  )
}
