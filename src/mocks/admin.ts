import type { AdminUser } from '@/types/domain'

export const uspAdmin: AdminUser = {
  id: 'admin-usp-1',
  name: 'Helena Prado',
  email: 'helena.prado@usp.br',
  scope: { kind: 'usp' },
}

export const quilombolaAdmin: AdminUser = {
  id: 'admin-kalunga-1',
  name: 'Benedita Souza',
  email: 'benedita.souza@kalunga.org.br',
  scope: { kind: 'quilombola', communityId: 'kalunga' },
}

/** No sign-in exists yet (auth spec deferred). Point this at quilombolaAdmin to preview the RF-13 profile. */
export const currentAdmin: AdminUser = uspAdmin
