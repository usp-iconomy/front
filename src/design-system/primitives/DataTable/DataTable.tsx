import type { ReactNode } from 'react'
import styles from './DataTable.module.css'

export type Column<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export type DataTableProps<T> = {
  caption: string
  columns: readonly Column<T>[]
  rows: readonly T[]
  rowKey: (row: T) => string
  /** Visually hides the caption; screen readers still announce it. */
  hideCaption?: boolean
}

export function DataTable<T>({ caption, columns, rows, rowKey, hideCaption = true }: DataTableProps<T>) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption
          style={
            hideCaption
              ? { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }
              : undefined
          }
        >
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} data-label={column.header}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
