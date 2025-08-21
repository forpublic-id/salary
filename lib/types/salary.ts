export interface SalaryGolongan {
  id: string
  golongan: string
  pangkat: string
  gajiPokok: number
  description: {
    id: string
    en: string
  }
  masaKerja: {
    min: number
    max: number
  }
}

export interface TunjanganKinerja {
  id: string
  kementerian: {
    id: string
    en: string
  }
  kode: string
  jabatan: {
    id: string
    en: string
  }
  golongan: string[]
  nominal: number
  kategori: 'struktural' | 'fungsional' | 'pelaksana'
}

export interface Benefits {
  id: string
  name: {
    id: string
    en: string
  }
  type: 'tunjangan_umum' | 'tunjangan_khusus' | 'benefit'
  nominal?: number
  formula?: string
  description: {
    id: string
    en: string
  }
  eligibility: string[]
}

export interface OfficialSalary {
  id: string
  position: {
    id: string
    en: string
  }
  level: 'nasional' | 'provinsi' | 'kabupaten_kota' | 'legislative'
  gajiPokok: number
  tunjangan: {
    name: {
      id: string
      en: string
    }
    nominal: number
  }[]
  totalKompensasi: number
  lastUpdated: string
  source: string
}

export interface HistoricalSalary {
  year: number
  golongan: string
  gajiPokok: number
  changePercentage: number
  regulation: string
}

export interface SalaryCalculation {
  gajiPokok: number
  tunjanganKinerja: number
  tunjanganLainnya: number
  totalBruto: number
  potongan: {
    pph21: number
    asuransi: number
    lainnya: number
    total: number
  }
  totalNetto: number
}

export interface SalaryFilter {
  golongan?: string[]
  kementerian?: string[]
  jabatan?: string[]
  salaryRange?: {
    min: number
    max: number
  }
  level?: string[]
}

export interface SalarySummary {
  totalPositions: number
  averageSalary: number
  medianSalary: number
  minSalary: number
  maxSalary: number
  lastUpdated: string
}