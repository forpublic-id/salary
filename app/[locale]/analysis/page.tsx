"use client"

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { SalaryCharts } from '@/components/salary/SalaryCharts'
import type { SalaryGolongan, TunjanganKinerja } from '@/lib/types/salary'

export default function AnalysisPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const t = useTranslations('analysis')
  const tCommon = useTranslations('common')
  
  const [golonganData, setGolonganData] = useState<SalaryGolongan[]>([])
  const [tunjanganData, setTunjanganData] = useState<TunjanganKinerja[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [golonganRes, tunjanganRes] = await Promise.all([
          fetch('/data/salary/pns/golongan.json'),
          fetch('/data/salary/pns/tunjangan-kinerja.json')
        ])
        
        const golonganData = await golonganRes.json()
        const tunjanganData = await tunjanganRes.json()
        
        setGolonganData(golonganData.golongan)
        setTunjanganData(tunjanganData.tunjanganKinerja)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">{tCommon('loading')}</div>
        </div>
      </div>
    )
  }

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
      
      <SalaryCharts 
        golonganData={golonganData}
        tunjanganData={tunjanganData}
        locale={locale}
      />
    </div>
  )
}