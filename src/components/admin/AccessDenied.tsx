import { PageHeader } from '@/design-system'

export function AccessDenied({
  description = 'Esta área não faz parte do seu perfil de administração. O menu mostra o que você pode abrir.',
}: {
  description?: string
}) {
  return <PageHeader title="Acesso restrito" description={description} />
}
