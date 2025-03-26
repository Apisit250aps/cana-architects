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
  description:
    'Award-winning architectural designs for residential, commercial and public spaces by Cana Architects',
  metadataBase: new URL('https://cana-architects.com'),
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
    url: 'https://cana-architects.com',
    title: 'Cana Architects',
    description:
      'Award-winning architectural designs for residential, commercial and public spaces by Cana Architects',
    siteName: 'Cana Architects',
    images: [
      {
        url: 'https://cana-architects.com/images/og-image.png',
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
    description:
      'Award-winning architectural designs for residential, commercial and public spaces by Cana Architects',
    creator: '@canaarchitects',
    images: ['https://cana-architects.com/images/twitter-image.png']
  },
  // Verification
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code'
  },
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
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
