'use client'

import { useState } from 'react'
import { Button, Chip, DataTable, SearchInput, TokenAmount, type Column } from '@/design-system'
import { formatDate } from '@/lib/format'
import { checkRoleChange, filterUsers, roleChangeErrorMessage, roleLabel, userRoles } from '@/lib/roles'
import type { ManagedUser, UserRole } from '@/types/domain'
import styles from './UserRoleManager.module.css'

type Announcement = { kind: 'success' | 'error'; message: string }

export type UserRoleManagerProps = {
  initialUsers: readonly ManagedUser[]
  /** The signed-in admin, who may not change their own role. */
  actorId: string
}

export function UserRoleManager({ initialUsers, actorId }: UserRoleManagerProps) {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  function changeRole(target: ManagedUser, nextRole: UserRole) {
    const error = checkRoleChange(users, actorId, target.id, nextRole)
    if (error) {
      setAnnouncement({ kind: 'error', message: roleChangeErrorMessage[error] })
      return
    }
    setUsers((current) =>
      current.map((candidate) => (candidate.id === target.id ? { ...candidate, role: nextRole } : candidate)),
    )
    setAnnouncement({ kind: 'success', message: `Papel de ${target.name} alterado para ${roleLabel[nextRole]}.` })
  }

  const columns: readonly Column<ManagedUser>[] = [
    {
      key: 'name',
      header: 'Membro',
      render: (row) => (
        <div>
          <p className={styles.name}>
            {row.name}
            {row.id === actorId && <span className={styles.you}> (você)</span>}
          </p>
          <p className={styles.email}>{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Papel',
      render: (row) => (
        <select
          aria-label={`Papel de ${row.name}`}
          className={styles.select}
          value={row.role}
          disabled={row.id === actorId}
          onChange={(event) => {
            const next = userRoles.find((role) => role === event.target.value)
            if (next) changeRole(row, next)
          }}
        >
          {userRoles.map((role) => (
            <option key={role} value={role}>
              {roleLabel[role]}
            </option>
          ))}
        </select>
      ),
    },
    { key: 'balance', header: 'Saldo', render: (row) => <TokenAmount value={row.tokenBalance} /> },
    { key: 'sent', header: 'Enviado em 30 dias', render: (row) => <TokenAmount value={row.sent30d} /> },
    { key: 'joined', header: 'Entrou em', render: (row) => <time dateTime={row.joinedAt}>{formatDate(row.joinedAt)}</time> },
  ]

  const visible = filterUsers(users, query, roleFilter)

  return (
    <div>
      <div className={styles.toolbar}>
        <SearchInput
          aria-label="Buscar por nome ou e-mail"
          placeholder="Buscar por nome ou e-mail"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className={styles.filters} role="group" aria-label="Filtrar por papel">
          <Chip active={roleFilter === 'all'} onClick={() => setRoleFilter('all')}>
            Todos
          </Chip>
          {userRoles.map((role) => (
            <Chip key={role} active={roleFilter === role} onClick={() => setRoleFilter(role)}>
              {roleLabel[role]}
            </Chip>
          ))}
        </div>
      </div>

      <p role="status" className={`${styles.announcement} ${announcement ? styles[announcement.kind] : ''}`.trim()}>
        {announcement?.message}
      </p>

      {visible.length === 0 ? (
        <div className={styles.empty}>
          <p>Ninguém encontrado. Confira a grafia ou limpe os filtros.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setQuery('')
              setRoleFilter('all')
            }}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <DataTable caption="Usuários da plataforma" columns={columns} rows={visible} rowKey={(row) => row.id} />
      )}
    </div>
  )
}
