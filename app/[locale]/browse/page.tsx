import { getTranslations } from 'next-intl/server'
import { generateSEOMetadata, generatePageKeywords, generateBrowseDescription } from '@/lib/seo'
import BrowsePageClient from './BrowsePageClient'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'browse' })
  
  const keywords = generatePageKeywords('browse', locale)
  const description = generateBrowseDescription(500, locale) // Estimate 500+ data points
  
  return generateSEOMetadata({
    title: t('title'),
    description,
    keywords,
    locale
  })
}

export default async function BrowsePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return <BrowsePageClient locale={locale} />
}