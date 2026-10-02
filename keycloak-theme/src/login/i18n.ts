import { i18nBuilder } from 'keycloakify/login'
import type { ThemeName } from '../kc.gen'

/** Keycloak's own pt-BR wording, aligned with the app's ("Criar conta", no "«" glyphs). */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    'pt-BR': {
      registerTitle: 'Criar conta',
      doRegister: 'Criar conta',
      noAccount: 'Ainda não tem conta?',
      usernameOrEmail: 'E-mail',
      email: 'E-mail',
      firstName: 'Nome',
      rememberMe: 'Manter conectado',
      backToLogin: 'Voltar para entrar',
      doSubmit: 'Continuar',
      emailInstruction: 'Informe o e-mail da sua conta e enviaremos as instruções para criar uma nova senha.',
      emailVerifyTitle: 'Confirme seu e-mail',
      errorTitle: 'Algo deu errado',
      backToApplication: 'Voltar para o USP Iconomy',
      errorTitleHtml: 'Algo deu errado',
      emailVerifyInstruction1: 'Enviamos um e-mail com o link para confirmar seu endereço.',
      emailVerifyInstruction2: 'Não recebeu?',
      emailVerifyInstruction3: 'para enviar de novo.',
      pageExpiredMsg1: 'Para começar de novo',
    },
  })
  .build()

type I18n = typeof ofTypeI18n

export { useI18n, type I18n }
