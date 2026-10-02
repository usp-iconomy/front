import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { KcPage } from './kc.gen'

async function previewContext() {
  if (!import.meta.env.DEV || window.kcContext) return
  const pageId = new URLSearchParams(window.location.search).get('page')
  if (!pageId) return
  const { getKcContextMock } = await import('./login/mock')
  window.kcContext = getKcContextMock({ pageId: pageId as 'login.ftl' })
}

previewContext().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {window.kcContext ? (
        <KcPage kcContext={window.kcContext} />
      ) : (
        <p>Sem contexto do Keycloak. Em desenvolvimento, abra com ?page=login.ftl</p>
      )}
    </StrictMode>,
  )
})
