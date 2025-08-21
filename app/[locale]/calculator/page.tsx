import { getTranslations } from 'next-intl/server'
import { SalaryCalculator } from '@/components/salary/SalaryCalculator'
import { generateSEOMetadata, generatePageKeywords, generateCalculatorDescription } from '@/lib/seo'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculator' })
  
  const keywords = generatePageKeywords('calculator', locale)
  const description = generateCalculatorDescription(locale)
  
  return generateSEOMetadata({
    title: t('title'),
    description,
    keywords,
    locale
  })
}

export default async function CalculatorPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('calculator')

  return (
    <div className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <SalaryCalculator locale={locale} />
      </div>
    </div>
  )
}