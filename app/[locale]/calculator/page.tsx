import { getTranslations } from 'next-intl/server'
import { SalaryCalculator } from '@/components/salary/SalaryCalculator'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculator' })
  
  return {
    title: `${t('title')} - Salary ForPublic.id`,
    description: t('subtitle'),
  }
}

export default async function CalculatorPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('calculator')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>
      
      <SalaryCalculator locale={locale} />
    </div>
  )
}