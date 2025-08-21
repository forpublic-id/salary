import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Salary ForPublic.id',
  description: 'Transparansi gaji PNS dan pejabat publik Indonesia',
  metadataBase: new URL('https://salary.forpublic.id'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}