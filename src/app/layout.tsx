import type { Metadata } from 'next'
import { Kanit, Prompt } from 'next/font/google'
import './globals.css'
import 'boxicons/css/boxicons.min.css'

const kanit = Kanit({
  variable: '--font-thai',
  subsets: ['thai'],
  weight: ['100', '200', '300', '400', '500', '700']
})

const prompt = Prompt({
  variable: '--font-latin',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Cana Architects',
  description: 'CANA is an architectural and interior design studio.',
  metadataBase: new URL('https://canaarchitects.com'),
  // Basic metadata
  applicationName: 'Cana Architects',
  authors: [{ name: 'Cana Architects' }],
  generator: 'Next.js',
  keywords: [
    'architecture',
    'design',
    'cana architects',
    'interior design',
    'residential',
    'commercial'
  ],
  // OpenGraph metadata
  openGraph: {
    type: 'website',
    url: 'https://canaarchitects.com',
    title: 'Cana Architects',
    description: 'CANA is an architectural and interior design studio.',
    siteName: 'Cana Architects',
    images: [
      {
        url: 'https://canaarchitects.com/assets/logo/squre-logo.png',
        width: 1200,
        height: 630,
        alt: 'Cana Architects'
      }
    ]
  },
  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Cana Architects',
    description: 'CANA is an architectural and interior design studio.',
    creator: '@canaarchitects',
    images: ['https://canaarchitects.com/assets/logo/squre-logo.png']
  },
  // Verification
  // verification: {
  //   google: 'google-site-verification-code',
  //   yandex: 'yandex-verification-code'
  // },
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" data-theme="light">
      <body className={`${kanit.variable} ${prompt.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
