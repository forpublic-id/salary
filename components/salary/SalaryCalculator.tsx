"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { salaryTracking } from '@/components/analytics/GoogleAnalytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, calculateSalary } from '@/lib/utils'
import type { SalaryGolongan, TunjanganKinerja, SalaryCalculation } from '@/lib/types/salary'

interface SalaryCalculatorProps {
  locale: string
}

export function SalaryCalculator({ locale }: SalaryCalculatorProps) {
  const t = useTranslations('calculator')
  const tCommon = useTranslations('common')
  
  const [golonganData, setGolonganData] = useState<SalaryGolongan[]>([])
  const [tunjanganData, setTunjanganData] = useState<TunjanganKinerja[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [selectedGolongan, setSelectedGolongan] = useState<string>('')
  const [masaKerja, setMasaKerja] = useState<number>(0)
  const [selectedKementerian, setSelectedKementerian] = useState<string>('')
  const [selectedJabatan, setSelectedJabatan] = useState<string>('')
  
  // Results
  const [calculation, setCalculation] = useState<SalaryCalculation | null>(null)

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

  const handleCalculate = () => {
    const golongan = golonganData.find(g => g.id === selectedGolongan)
    if (!golongan) return

    // Find applicable tunjangan kinerja
    const tunjangan = tunjanganData.find(t => 
      t.kementerian.id === selectedKementerian &&
      t.jabatan.id === selectedJabatan &&
      t.golongan.includes(golongan.golongan)
    )

    const gajiPokok = golongan.gajiPokok
    const tunjanganKinerja = tunjangan?.nominal || 0
    const tunjanganLain = 500000 // Basic allowances

    const result = calculateSalary(gajiPokok, tunjanganKinerja, tunjanganLain)
    setCalculation(result)

    // Track calculator usage
    salaryTracking.calculatorUse(golongan.golongan, selectedKementerian)
  }

  const availableKementerian = Array.from(new Set(
    tunjanganData.map(t => t.kementerian.id)
  ))

  const availableJabatan = tunjanganData
    .filter(t => t.kementerian.id === selectedKementerian)
    .map(t => ({ id: t.jabatan.id, name: t.jabatan[locale as 'id' | 'en'] }))

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">{tCommon('loading')}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Golongan Selection */}
            <div className="space-y-2">
              <Label htmlFor="golongan">{t('golongan')}</Label>
              <Select value={selectedGolongan} onValueChange={setSelectedGolongan}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectGolongan')} />
                </SelectTrigger>
                <SelectContent>
                  {golonganData.map((golongan) => (
                    <SelectItem key={golongan.id} value={golongan.id}>
                      {golongan.golongan} - {golongan.pangkat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Masa Kerja */}
            <div className="space-y-2">
              <Label htmlFor="masaKerja">{t('masaKerja')}</Label>
              <Input
                id="masaKerja"
                type="number"
                min="0"
                max="35"
                value={masaKerja}
                onChange={(e) => setMasaKerja(Number(e.target.value))}
              />
            </div>

            {/* Kementerian */}
            <div className="space-y-2">
              <Label htmlFor="kementerian">{t('kementerian')}</Label>
              <Select value={selectedKementerian} onValueChange={setSelectedKementerian}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectKementerian')} />
                </SelectTrigger>
                <SelectContent>
                  {availableKementerian.map((kementerian) => (
                    <SelectItem key={kementerian} value={kementerian}>
                      {kementerian}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Jabatan */}
            <div className="space-y-2">
              <Label htmlFor="jabatan">{t('jabatan')}</Label>
              <Select 
                value={selectedJabatan} 
                onValueChange={setSelectedJabatan}
                disabled={!selectedKementerian}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectJabatan')} />
                </SelectTrigger>
                <SelectContent>
                  {availableJabatan.map((jabatan) => (
                    <SelectItem key={jabatan.id} value={jabatan.id}>
                      {jabatan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleCalculate}
              disabled={!selectedGolongan}
              size="lg"
            >
              {t('calculate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle>{t('results.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{t('results.gajiPokok')}</span>
                  <Badge variant="secondary">
                    {formatCurrency(calculation.gajiPokok, locale)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{t('results.tunjanganKinerja')}</span>
                  <Badge variant="secondary">
                    {formatCurrency(calculation.tunjanganKinerja, locale)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{t('results.tunjanganLain')}</span>
                  <Badge variant="secondary">
                    {formatCurrency(calculation.tunjanganLainnya, locale)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <span className="font-semibold">{t('results.totalBruto')}</span>
                  <Badge>
                    {formatCurrency(calculation.totalBruto, locale)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                  <span className="font-medium">{t('results.potongan')}</span>
                  <Badge variant="destructive">
                    -{formatCurrency(calculation.potongan.total, locale)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <span className="font-bold text-lg">{t('results.totalNetto')}</span>
                  <Badge className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700">
                    {formatCurrency(calculation.totalNetto, locale)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}