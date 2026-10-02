import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Barlow_Condensed, Roboto } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'USP Iconomy | Economia Simbólica do Conhecimento',
  description:
    'Plataforma de educação comunitária da USP/IEA onde o acesso a cursos é conquistado por circulação e contribuição, não por pagamento.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1094ab',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  )
}
