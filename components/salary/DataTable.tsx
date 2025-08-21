"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronUp, ChevronDown, Download, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import type { SalaryGolongan, TunjanganKinerja } from '@/lib/types/salary'

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

interface DataTableProps {
  data: CombinedSalaryData[]
  locale: string
  loading?: boolean
}

type SortField = 'golongan' | 'gajiPokok' | 'totalEstimasi' | 'kementerian'
type SortDirection = 'asc' | 'desc'

export function DataTable({ data, locale, loading = false }: DataTableProps) {
  const t = useTranslations('browse')
  const tCommon = useTranslations('common')
  
  const [sortField, setSortField] = useState<SortField>('totalEstimasi')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    let aVal: any = a[sortField]
    let bVal: any = b[sortField]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const exportData = () => {
    const csv = [
      ['Golongan', 'Pangkat', 'Gaji Pokok', 'Kementerian', 'Jabatan', 'Tunjangan Kinerja', 'Total Estimasi'].join(','),
      ...sortedData.map(item => [
        item.golongan,
        item.pangkat,
        item.gajiPokok,
        item.kementerian || '',
        item.jabatan || '',
        item.tunjanganKinerja || 0,
        item.totalEstimasi
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'salary-data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold hover:bg-transparent justify-start"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
        )}
      </span>
    </Button>
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">{tCommon('loading')}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Salary Data ({sortedData.length.toLocaleString()} entries)
          </CardTitle>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {tCommon('export')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  <SortButton field="golongan">Grade</SortButton>
                </th>
                <th className="text-left p-3">Rank</th>
                <th className="text-left p-3">
                  <SortButton field="gajiPokok">Base Salary</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="kementerian">Ministry</SortButton>
                </th>
                <th className="text-left p-3">Position</th>
                <th className="text-left p-3">Performance Allowance</th>
                <th className="text-left p-3">
                  <SortButton field="totalEstimasi">Total Estimate</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <Badge variant="outline">{item.golongan}</Badge>
                  </td>
                  <td className="p-3 text-sm">{item.pangkat}</td>
                  <td className="p-3 font-mono text-sm">
                    {formatCurrency(item.gajiPokok, locale)}
                  </td>
                  <td className="p-3 text-sm max-w-xs truncate">
                    {item.kementerian || '-'}
                  </td>
                  <td className="p-3 text-sm">{item.jabatan || '-'}</td>
                  <td className="p-3 font-mono text-sm">
                    {item.tunjanganKinerja ? 
                      formatCurrency(item.tunjanganKinerja, locale) : 
                      '-'
                    }
                  </td>
                  <td className="p-3">
                    <Badge className="font-mono">
                      {formatCurrency(item.totalEstimasi, locale)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedData.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-1">
                      {item.golongan}
                    </Badge>
                    <p className="font-medium">{item.pangkat}</p>
                  </div>
                  <Badge className="font-mono">
                    {formatCurrency(item.totalEstimasi, locale)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Salary:</span>
                    <span className="font-mono">
                      {formatCurrency(item.gajiPokok, locale)}
                    </span>
                  </div>
                  
                  {item.kementerian && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ministry:</span>
                      <span className="text-right max-w-xs truncate">
                        {item.kementerian}
                      </span>
                    </div>
                  )}
                  
                  {item.jabatan && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position:</span>
                      <span>{item.jabatan}</span>
                    </div>
                  )}
                  
                  {item.tunjanganKinerja && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Performance:</span>
                      <span className="font-mono">
                        {formatCurrency(item.tunjanganKinerja, locale)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} entries
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}