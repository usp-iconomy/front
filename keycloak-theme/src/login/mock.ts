import { createGetKcContextMock } from 'keycloakify/login/KcContext'
import type { KcContextExtension, KcContextExtensionPerPage } from './KcContext'

/** Dev-only preview of a page without Keycloak: `npm run dev`, then `/?page=login.ftl`. */
export const { getKcContextMock } = createGetKcContextMock({
  kcContextExtension: { themeName: 'usp-iconomy', properties: {} } satisfies KcContextExtension,
  kcContextExtensionPerPage: {} satisfies KcContextExtensionPerPage,
  // Closest to the `iconomy` realm in usp-iconomy/api that the mock types allow.
  overrides: {
    locale: { currentLanguageTag: 'pt-BR' },
    realm: { displayName: 'USP Iconomy', registrationEmailAsUsername: true },
  },
})
