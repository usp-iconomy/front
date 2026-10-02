import { useEffect } from 'react'
import { kcSanitize } from 'keycloakify/lib/kcSanitize'
import { getKcClsx } from 'keycloakify/login/lib/kcClsx'
import type { TemplateProps } from 'keycloakify/login/TemplateProps'
import { useInitialize } from 'keycloakify/login/Template.useInitialize'
import { useSetClassName } from 'keycloakify/tools/useSetClassName'
import type { I18n } from './i18n'
import type { KcContext } from './KcContext'

const pageTitle: Partial<Record<KcContext['pageId'], string>> = {
  'login.ftl': 'Entrar',
  'register.ftl': 'Criar conta',
  'login-reset-password.ftl': 'Recuperar senha',
  'login-update-password.ftl': 'Nova senha',
  'login-verify-email.ftl': 'Confirmar e-mail',
  'info.ftl': 'Aviso',
  'error.ftl': 'Algo deu errado',
}

const messageLabel = {
  success: 'Pronto',
  warning: 'Atenção',
  error: 'Algo deu errado',
  info: 'Informação',
} as const

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes })
  const { msg } = i18n
  const { auth, url, message, isAppInitiatedAction } = kcContext

  useEffect(() => {
    const title = documentTitle ?? pageTitle[kcContext.pageId]
    document.title = title ? `${title} | USP Iconomy` : 'USP Iconomy'
  }, [documentTitle, kcContext.pageId])

  useSetClassName({ qualifiedName: 'html', className: kcClsx('kcHtmlClass') })
  useSetClassName({ qualifiedName: 'body', className: bodyClassName ?? kcClsx('kcBodyClass') })

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss })
  if (!isReadyToRender) return null

  const showAttemptedUsername = auth !== undefined && auth.showUsername && !auth.showResetCredentials
  // App-initiated actions should not see warnings about completing the action during login.
  const showMessage =
    displayMessage && message !== undefined && (message.type !== 'warning' || !isAppInitiatedAction)

  return (
    <div className="ui-page">
      <main className="ui-column">
        <header className="ui-brand">
          <p className="ui-brand-name">USP Iconomy</p>
          <p className="ui-brand-slogan">Conhecimento que circula, transforma</p>
        </header>

        {showAttemptedUsername ? (
          <div className="ui-attempted">
            <span>{auth.attemptedUsername}</span>
            <a href={url.loginRestartFlowUrl}>Trocar de conta</a>
          </div>
        ) : (
          <h1 className="ui-title">{headerNode}</h1>
        )}

        {showMessage && (
          <div className={`ui-alert ui-alert-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
            <strong className="ui-alert-label">{messageLabel[message.type]}</strong>
            <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
          </div>
        )}

        {children}

        {auth !== undefined && auth.showTryAnotherWayLink && (
          <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
            <input type="hidden" name="tryAnotherWay" value="on" />
            <button type="submit" className="ui-link-button">
              {msg('doTryAnotherWay')}
            </button>
          </form>
        )}

        {socialProvidersNode}

        {displayInfo && (
          <div id="kc-info" className="ui-info">
            {infoNode}
          </div>
        )}
      </main>
    </div>
  )
}
