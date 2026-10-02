import { Suspense, lazy } from 'react'
import type { ClassKey } from 'keycloakify/login'
import DefaultPage from 'keycloakify/login/DefaultPage'
import type { KcContext } from './KcContext'
import { useI18n } from './i18n'
import Template from './Template'
import './fonts'
import './login.css'

const UserProfileFormFields = lazy(() => import('keycloakify/login/UserProfileFormFields'))

// Our CSS targets the class keys Keycloakify emits (e.g. `.kcFormGroupClass`); no PatternFly.
const classes = {} satisfies { [key in ClassKey]?: string }

export default function KcPage({ kcContext }: { kcContext: KcContext }) {
  const { i18n } = useI18n({ kcContext })

  return (
    <Suspense>
      <DefaultPage
        kcContext={kcContext}
        i18n={i18n}
        classes={classes}
        Template={Template}
        doUseDefaultCss={false}
        UserProfileFormFields={UserProfileFormFields}
        doMakeUserConfirmPassword
      />
    </Suspense>
  )
}
