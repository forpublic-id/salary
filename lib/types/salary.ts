export interface SalaryGolongan {
  id: string;
  golongan: string;
  pangkat: string;
  gajiPokok: number;
  description: {
    id: string;
    en: string;
  };
  masaKerja: {
    min: number;
    max: number;
  };
}

export interface TunjanganKinerja {
  id: string;
  kementerian: {
    id: string;
    en: string;
  };
  kode: string;
  jabatan: {
    id: string;
    en: string;
  };
  golongan: string[];
  nominal: number;
  kategori: "struktural" | "fungsional" | "pelaksana";
  regulations?: Array<{
    title: string;
    url: string;
  }>;
}

export interface Benefits {
  id: string;
  name: {
    id: string;
    en: string;
  };
  type: "tunjangan_umum" | "tunjangan_khusus" | "benefit";
  nominal?: number;
  formula?: string;
  description: {
    id: string;
    en: string;
  };
  eligibility: string[];
}

export interface OfficialSalary {
  id: string;
  position: {
    id: string;
    en: string;
  };
  level: "nasional" | "provinsi" | "kabupaten_kota" | "legislative";
  gajiPokok: number;
  tunjangan: {
    name: {
      id: string;
      en: string;
    };
    nominal: number;
  }[];
  totalKompensasi: number;
  lastUpdated: string;
  source: string;
}

export interface HistoricalSalary {
  year: number;
  golongan: string;
  gajiPokok: number;
  changePercentage: number;
  regulation: string;
}

export interface SalaryCalculation {
  gajiPokok: number;
  tunjanganKinerja: number;
  tunjanganLainnya: number;
  totalBruto: number;
  potongan: {
    pph21: number;
    asuransi: number;
    lainnya: number;
    total: number;
  };
  totalNetto: number;
}

export interface SalaryFilter {
  golongan?: string[];
  kementerian?: string[];
  jabatan?: string[];
  kategori?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  level?: string[];
}

export interface SalarySummary {
  totalPositions: number;
  averageSalary: number;
  medianSalary: number;
  minSalary: number;
  maxSalary: number;
  lastUpdated: string;
}

// Regional Wage Types
export interface RegionalWage {
  id: string;
  province: {
    id: string;
    en: string;
  };
  city: {
    id: string;
    en: string;
  };
  ump: number; // Upah Minimum Provinsi
  umr: number; // Upah Minimum Regional/Kota
  type: "provincial" | "city" | "regency";
  effectiveDate: string;
  previousYear: number;
  increasePercent: number;
  costOfLiving:
    | "very_low"
    | "low"
    | "medium"
    | "medium_high"
    | "high"
    | "very_high";
  population: number;
}

export interface RegionalWageData {
  metadata: {
    lastUpdated: string;
    source: string;
    currency: string;
    version: string;
    description: {
      id: string;
      en: string;
    };
  };
  regionalWages: RegionalWage[];
}

export interface RegionalWageFilter {
  provinces?: string[];
  cities?: string[];
  wageRange?: {
    min: number;
    max: number;
  };
  costOfLiving?: string[];
  type?: ("provincial" | "city" | "regency")[];
  year?: number;
}

export interface RegionalWageComparison {
  location: string;
  ump: number;
  umr: number;
  costOfLiving: string;
  realWage: number; // Adjusted for cost of living
  purchasingPower: number;
}

export interface WageCalculation {
  selectedRegion: RegionalWage;
  monthlyWage: number;
  dailyWage: number;
  hourlyWage: number;
  annualWage: number;
  costOfLivingAdjusted: number;
  comparisonWithJakarta: {
    percentage: number;
    difference: number;
  };
}
