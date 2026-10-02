export { auth as proxy } from '@/auth'

export const config = {
  // Skip Next internals and static files; Auth.js decides the rest through `authorized`.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)'],
}
