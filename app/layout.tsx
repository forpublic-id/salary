import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GoogleAnalytics } from '@next/third-parties/google'
import { generateSEOMetadata, generateStructuredData } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Transparansi Gaji PNS & Pejabat Publik Indonesia',
  description: 'Platform transparansi komprehensif untuk mengakses informasi gaji PNS dan pejabat publik Indonesia. Kalkulator interaktif, data browsing, dan analisis mendalam.',
  keywords: ['gaji PNS', 'tunjangan kinerja', 'gaji pejabat publik', 'transparansi pemerintah', 'ForPublic.id', 'kalkulator gaji', 'pegawai negeri sipil'],
})

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  const websiteStructuredData = generateStructuredData('website', {})
  const organizationStructuredData = generateStructuredData('organization', {})

  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        
        {/* Google Site Verification */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
        )}
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preconnect for better performance */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {children}
        
        {/* Google Analytics with Next.js third-party integration */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}