'use client'

import { useState } from 'react'
import { Button, DataTable, StatusText, TokenAmount, type Column } from '@/design-system'
import {
  codeStatus,
  codeStatusPresentation,
  distributionCodesCsv,
  generateCode,
  type NewDistributionCode,
} from '@/lib/distribution-codes'
import { formatDate, formatNumber } from '@/lib/format'
import type { DistributionCode } from '@/types/domain'
import { CsvDownloadButton } from './CsvDownloadButton'
import { DistributionCodeForm, type CourseOption } from './DistributionCodeForm'
import styles from './DistributionCodeManager.module.css'

export type DistributionCodeManagerProps = {
  initialCodes: readonly DistributionCode[]
  courses: readonly CourseOption[]
}

export function DistributionCodeManager({ initialCodes, courses }: DistributionCodeManagerProps) {
  const [codes, setCodes] = useState(initialCodes)
  const [creating, setCreating] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [now] = useState(() => Date.now())

  const courseTitle = (courseId: string) => courses.find((course) => course.id === courseId)?.title

  function handleCreate(value: NewDistributionCode) {
    const code = generateCode(new Set(codes.map((existing) => existing.code)))
    setCodes((current) => [{ ...value, code, redemptionsUsed: 0 }, ...current])
    setCreating(false)
    setAnnouncement(`Código ${code} criado.`)
  }

  const columns: readonly Column<DistributionCode>[] = [
    { key: 'code', header: 'Código', render: (row) => <code className={styles.code}>{row.code}</code> },
    { key: 'name', header: 'Nome', render: (row) => row.name },
    { key: 'tokens', header: 'Por resgate', render: (row) => <TokenAmount value={row.tokensPerRedemption} /> },
    {
      key: 'redemptions',
      header: 'Resgates',
      render: (row) => `${formatNumber(row.redemptionsUsed)} de ${formatNumber(row.maxRedemptions)}`,
    },
    {
      key: 'validity',
      header: 'Validade',
      render: (row) => `${formatDate(row.validFrom)} a ${formatDate(row.validUntil)}`,
    },
    { key: 'course', header: 'Curso', render: (row) => (row.courseId ? (courseTitle(row.courseId) ?? row.courseId) : 'Sem curso') },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const presentation = codeStatusPresentation[codeStatus(row, now)]
        return (
          <StatusText tone={presentation.tone} icon={presentation.icon}>
            {presentation.label}
          </StatusText>
        )
      },
    },
  ]

  return (
    <div>
      <div className={styles.toolbar}>
        <Button onClick={() => setCreating(true)} disabled={creating}>
          Novo código
        </Button>
        <CsvDownloadButton
          filename="codigos-de-distribuicao.csv"
          csv={() => distributionCodesCsv(codes, now, courseTitle)}
          label="Exportar CSV"
        />
      </div>

      <p role="status" className={styles.announcement}>
        {announcement}
      </p>

      {creating && (
        <DistributionCodeForm courses={courses} now={now} onCreate={handleCreate} onCancel={() => setCreating(false)} />
      )}

      <DataTable caption="Códigos de distribuição" columns={columns} rows={codes} rowKey={(row) => row.code} />
    </div>
  )
}
