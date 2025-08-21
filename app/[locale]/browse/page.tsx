"use client"

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { SearchInterface } from '@/components/salary/SearchInterface'
import { DataTable } from '@/components/salary/DataTable'
import type { SalaryGolongan, TunjanganKinerja, SalaryFilter } from '@/lib/types/salary'

interface CombinedSalaryData {
  id: string
  golongan: string
  pangkat: string
  gajiPokok: number
  kementerian?: string
  jabatan?: string
  tunjanganKinerja?: number
  totalEstimasi: number
  kategori: string
}

export default function BrowsePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const t = useTranslations('browse')
  
  const [golonganData, setGolonganData] = useState<SalaryGolongan[]>([])
  const [tunjanganData, setTunjanganData] = useState<TunjanganKinerja[]>([])
  const [combinedData, setCombinedData] = useState<CombinedSalaryData[]>([])
  const [filteredData, setFilteredData] = useState<CombinedSalaryData[]>([])
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
        
        // Combine data for table display
        const combined: CombinedSalaryData[] = []
        
        // Add base golongan data
        golonganData.golongan.forEach((golongan: SalaryGolongan) => {
          combined.push({
            id: golongan.id,
            golongan: golongan.golongan,
            pangkat: golongan.pangkat,
            gajiPokok: golongan.gajiPokok,
            totalEstimasi: golongan.gajiPokok + 500000, // Basic estimate
            kategori: 'base'
          })
        })
        
        // Add tunjangan kinerja data
        tunjanganData.tunjanganKinerja.forEach((tunjangan: TunjanganKinerja) => {
          tunjangan.golongan.forEach(golonganStr => {
            const golongan = golonganData.golongan.find((g: SalaryGolongan) => 
              g.golongan === golonganStr
            )
            
            if (golongan) {
              combined.push({
                id: `${tunjangan.id}-${golongan.id}`,
                golongan: golongan.golongan,
                pangkat: golongan.pangkat,
                gajiPokok: golongan.gajiPokok,
                kementerian: tunjangan.kementerian[locale as 'id' | 'en'],
                jabatan: tunjangan.jabatan[locale as 'id' | 'en'],
                tunjanganKinerja: tunjangan.nominal,
                totalEstimasi: golongan.gajiPokok + tunjangan.nominal + 500000,
                kategori: tunjangan.kategori
              })
            }
          })
        })
        
        setCombinedData(combined)
        setFilteredData(combined)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [locale])

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredData(combinedData)
      return
    }
    
    const filtered = combinedData.filter(item =>
      item.golongan.toLowerCase().includes(query.toLowerCase()) ||
      item.pangkat.toLowerCase().includes(query.toLowerCase()) ||
      item.kementerian?.toLowerCase().includes(query.toLowerCase()) ||
      item.jabatan?.toLowerCase().includes(query.toLowerCase())
    )
    
    setFilteredData(filtered)
  }

  const handleFilter = (filters: SalaryFilter) => {
    let filtered = [...combinedData]
    
    if (filters.golongan && filters.golongan.length > 0) {
      filtered = filtered.filter(item =>
        filters.golongan!.some(g => item.golongan.includes(g))
      )
    }
    
    if (filters.kementerian && filters.kementerian.length > 0) {
      filtered = filtered.filter(item =>
        item.kementerian && filters.kementerian!.includes(item.kementerian)
      )
    }
    
    if (filters.salaryRange) {
      filtered = filtered.filter(item =>
        item.totalEstimasi >= (filters.salaryRange!.min || 0) &&
        item.totalEstimasi <= (filters.salaryRange!.max || Infinity)
      )
    }
    
    setFilteredData(filtered)
  }

  const handleSort = (sortBy: string) => {
    const sorted = [...filteredData].sort((a, b) => {
      switch (sortBy) {
        case 'salaryHigh':
          return b.totalEstimasi - a.totalEstimasi
        case 'salaryLow':
          return a.totalEstimasi - b.totalEstimasi
        case 'golongan':
          return a.golongan.localeCompare(b.golongan)
        case 'alphabetical':
          return a.pangkat.localeCompare(b.pangkat)
        default:
          return 0
      }
    })
    
    setFilteredData(sorted)
  }

  const availableGolongan = Array.from(new Set(
    combinedData.map(item => item.golongan)
  )).sort()
  
  const availableKementerian = Array.from(new Set(
    combinedData.filter(item => item.kementerian)
      .map(item => item.kementerian!)
  )).sort()

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
      
      <div className="space-y-6">
        <SearchInterface
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          availableGolongan={availableGolongan}
          availableKementerian={availableKementerian}
        />
        
        <DataTable
          data={filteredData}
          locale={locale}
          loading={loading}
        />
      </div>
    </div>
  )
}