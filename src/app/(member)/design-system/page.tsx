'use client'

import { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  CodeInput,
  DataTable,
  Divider,
  FlowStep,
  Icon,
  InfoBox,
  Input,
  MetricCard,
  MetricGrid,
  PageHeader,
  SearchInput,
  SectionHeader,
  StatBox,
  StatGrid,
  StatusText,
  Textarea,
  TokenAmount,
  icons,
  type IconName,
} from '@/design-system'
import { accessTypePresentation, accessTypes } from '@/lib/access-type'
import styles from './page.module.css'

const colorTokens = [
  { name: 'Accent', token: '--color-accent' },
  { name: 'Accent strong', token: '--color-accent-strong' },
  { name: 'Accent light', token: '--color-accent-light' },
  { name: 'Accent soft', token: '--color-accent-soft' },
  { name: 'Yellow', token: '--color-yellow' },
  { name: 'Background', token: '--color-bg' },
  { name: 'Surface', token: '--color-surface' },
  { name: 'Border', token: '--color-border' },
  { name: 'Text', token: '--color-text' },
  { name: 'Text muted', token: '--color-text-muted' },
  { name: 'Positive', token: '--color-positive' },
  { name: 'Negative', token: '--color-negative' },
] as const

const typeScale = [
  { token: '--font-size-5xl', label: 'Título de página' },
  { token: '--font-size-3xl', label: 'Número de destaque' },
  { token: '--font-size-2xl', label: 'Título de seção' },
  { token: '--font-size-xl', label: 'Subtítulo' },
  { token: '--font-size-base', label: 'Corpo de texto' },
  { token: '--font-size-sm', label: 'Texto secundário' },
  { token: '--font-size-2xs', label: 'Rótulo e badge' },
] as const

type SampleRow = { id: string; label: string; value: string }

const sampleRows: readonly SampleRow[] = [
  { id: '1', label: 'Primeira linha', value: 'Valor A' },
  { id: '2', label: 'Segunda linha', value: 'Valor B' },
]

export default function DesignSystemPage() {
  const [activeChip, setActiveChip] = useState<string>('open')

  return (
    <>
      <PageHeader
        title="Design system"
        description="Catálogo vivo das primitivas. Tudo o que aparece aqui vem de src/design-system e usa apenas tokens."
      />

      <section className={styles.section}>
        <SectionHeader title="Cores" />
        <ul className={styles.swatches}>
          {colorTokens.map((entry) => (
            <li key={entry.token} className={styles.swatch}>
              <div className={styles.chipSample} style={{ background: `var(${entry.token})` }} />
              <div className={styles.swatchMeta}>
                <div className={styles.swatchName}>{entry.name}</div>
                <div className={styles.swatchToken}>{entry.token}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Tipografia" />
        <ul className={styles.typeSample}>
          {typeScale.map((entry) => (
            <li key={entry.token}>
              <span className={styles.typeToken}>{entry.token}</span>
              <span style={{ fontSize: `var(${entry.token})` }}>{entry.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Botões" />
        <div className={styles.row}>
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button size="sm">Pequeno</Button>
          <Button disabled>Desabilitado</Button>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Badges de tipo de acesso" />
        <div className={styles.row}>
          {accessTypes.map((accessType) => {
            const { label, tone } = accessTypePresentation[accessType]
            return (
              <Badge key={accessType} tone={tone}>
                {label}
              </Badge>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Chips de filtro" />
        <div className={styles.row}>
          {accessTypes.map((accessType) => (
            <Chip
              key={accessType}
              active={activeChip === accessType}
              onClick={() => setActiveChip(accessType)}
            >
              {accessTypePresentation[accessType].longLabel}
            </Chip>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Campos" />
        <div className={styles.row}>
          <Input placeholder="Campo de texto" aria-label="Campo de texto" />
          <SearchInput placeholder="Buscar..." aria-label="Buscar" />
          <CodeInput placeholder="ABC12345" maxLength={8} aria-label="Código de distribuição" />
        </div>
        <div style={{ marginTop: 'var(--space-3)', maxWidth: 420 }}>
          <Textarea placeholder="Área de texto" aria-label="Área de texto" />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Valores e status" />
        <div className={styles.row}>
          <TokenAmount value={450} showUnit />
          <TokenAmount value={100} direction="incoming" />
          <TokenAmount value={50} direction="outgoing" />
          <StatusText>Completo</StatusText>
          <StatusText tone="neutral" icon="doc">
            Pendente
          </StatusText>
          <Avatar name="Maria Joana" />
          <Avatar name="Coletivo Malê" size="lg" initialsCount={1} />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Superfícies" />
        <StatGrid>
          <StatBox icon="wallet" label="Tokens" value={450} caption="Saldo disponível" />
          <StatBox icon="medal" label="Tokens Alma" value={3} caption="Não-transferíveis" />
        </StatGrid>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <MetricGrid>
            <MetricCard icon="users" label="Participantes" value="1.247" delta="+12% este mês" />
            <MetricCard icon="trendUp" label="SROI" value="4,2×" delta="por real investido" />
          </MetricGrid>
        </div>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Card interactive>Card com afordância de hover</Card>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Fluxo em etapas" />
        <FlowStep step={1} title="Etapa concluída" description="Descrição da etapa." status="done" />
        <FlowStep step={2} title="Etapa atual" description="Descrição da etapa." status="current" />
        <FlowStep step={3} title="Etapa pendente" description="Descrição da etapa." status="pending" />
      </section>

      <section className={styles.section}>
        <SectionHeader title="Tabela responsiva" />
        <DataTable
          caption="Exemplo de tabela"
          columns={[
            { key: 'label', header: 'Rótulo', render: (row: SampleRow) => row.label },
            { key: 'value', header: 'Valor', render: (row: SampleRow) => row.value },
          ]}
          rows={sampleRows}
          rowKey={(row) => row.id}
        />
      </section>

      <section className={styles.section}>
        <SectionHeader title="Caixa informativa" />
        <InfoBox title="Título da caixa" icon="shield" items={['Primeiro item', 'Segundo item']}>
          Texto de apoio da caixa informativa.
        </InfoBox>
      </section>

      <Divider />

      <section className={styles.section}>
        <SectionHeader title="Ícones" />
        <ul className={styles.iconGrid}>
          {(Object.keys(icons) as IconName[]).map((name) => (
            <li key={name} className={styles.iconCell}>
              <Icon name={name} size={22} color="var(--color-accent-strong)" />
              {name}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
