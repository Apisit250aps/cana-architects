import type { Metadata } from 'next'
import { Kanit, Prompt } from 'next/font/google'
import './globals.css'
import 'boxicons/css/boxicons.min.css'

const kanit = Kanit({
  variable: '--font-thai',
  subsets: ['thai'],
  weight: ['300', '400', '500', '700']
})

const prompt = Prompt({
  variable: '--font-latin',
  subsets: ['latin'],
  weight: ['100','200','300', '400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Cana Architects',
  description: 'Cana Architects'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} ${prompt.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
