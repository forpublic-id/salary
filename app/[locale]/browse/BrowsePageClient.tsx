"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SearchInterface } from "@/components/salary/SearchInterface";
import { DataTable } from "@/components/salary/DataTable";
import { MinistryView } from "@/components/salary/MinistryView";
import { ComparisonTool } from "@/components/salary/ComparisonTool";
import { PageWrapper } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Table, Building2, ArrowUpDown } from "lucide-react";
import type {
  SalaryGolongan,
  TunjanganKinerja,
  SalaryFilter,
} from "@/lib/types/salary";

interface CombinedSalaryData {
  id: string;
  golongan: string;
  pangkat: string;
  gajiPokok: number;
  kementerian?: string;
  jabatan?: string;
  tunjanganKinerja?: number;
  totalEstimasi: number;
  kategori: string;
}

interface BrowsePageClientProps {
  locale: string;
}

export default function BrowsePageClient({ locale }: BrowsePageClientProps) {
  const t = useTranslations("browse");

  const [golonganData, setGolonganData] = useState<SalaryGolongan[]>([]);
  const [tunjanganData, setTunjanganData] = useState<TunjanganKinerja[]>([]);
  const [combinedData, setCombinedData] = useState<CombinedSalaryData[]>([]);
  const [filteredData, setFilteredData] = useState<CombinedSalaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "ministry" | "comparison">("table");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [golonganRes, tunjanganRes] = await Promise.all([
          fetch("/data/salary/pns/golongan.json"),
          fetch("/data/salary/pns/tunjangan-kinerja.json"),
        ]);

        const golonganData = await golonganRes.json();
        const tunjanganData = await tunjanganRes.json();

        setGolonganData(golonganData.golongan);
        setTunjanganData(tunjanganData.tunjanganKinerja);

        // Combine data for table display
        const combined: CombinedSalaryData[] = [];

        // Add base golongan data
        golonganData.golongan.forEach((golongan: SalaryGolongan) => {
          combined.push({
            id: golongan.id,
            golongan: golongan.golongan,
            pangkat: golongan.pangkat,
            gajiPokok: golongan.gajiPokok,
            totalEstimasi: golongan.gajiPokok + 500000, // Basic estimate
            kategori: "base",
          });
        });

        // Add tunjangan kinerja data
        tunjanganData.tunjanganKinerja.forEach(
          (tunjangan: TunjanganKinerja) => {
            tunjangan.golongan.forEach((golonganStr) => {
              const golongan = golonganData.golongan.find(
                (g: SalaryGolongan) => g.golongan === golonganStr,
              );

              if (golongan) {
                combined.push({
                  id: `${tunjangan.id}-${golongan.id}`,
                  golongan: golongan.golongan,
                  pangkat: golongan.pangkat,
                  gajiPokok: golongan.gajiPokok,
                  kementerian: tunjangan.kementerian[locale as "id" | "en"],
                  jabatan: tunjangan.jabatan[locale as "id" | "en"],
                  tunjanganKinerja: tunjangan.nominal,
                  totalEstimasi:
                    golongan.gajiPokok + tunjangan.nominal + 500000,
                  kategori: tunjangan.kategori,
                });
              }
            });
          },
        );

        setCombinedData(combined);
        setFilteredData(combined);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredData(combinedData);
      return;
    }

    const filtered = combinedData.filter(
      (item) =>
        item.golongan.toLowerCase().includes(query.toLowerCase()) ||
        item.pangkat.toLowerCase().includes(query.toLowerCase()) ||
        item.kementerian?.toLowerCase().includes(query.toLowerCase()) ||
        item.jabatan?.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredData(filtered);
  };

  const handleFilter = (filters: SalaryFilter) => {
    let filtered = [...combinedData];

    if (filters.golongan && filters.golongan.length > 0) {
      filtered = filtered.filter((item) =>
        filters.golongan!.some((g) => item.golongan.includes(g)),
      );
    }

    if (filters.kementerian && filters.kementerian.length > 0) {
      filtered = filtered.filter(
        (item) =>
          item.kementerian && filters.kementerian!.includes(item.kementerian),
      );
    }

    if (filters.kategori && filters.kategori.length > 0) {
      filtered = filtered.filter((item) =>
        filters.kategori!.includes(item.kategori),
      );
    }

    if (filters.salaryRange) {
      filtered = filtered.filter(
        (item) =>
          item.totalEstimasi >= (filters.salaryRange!.min || 0) &&
          item.totalEstimasi <= (filters.salaryRange!.max || Infinity),
      );
    }

    setFilteredData(filtered);
  };

  const handleSort = (sortBy: string) => {
    const sorted = [...filteredData].sort((a, b) => {
      switch (sortBy) {
        case "salaryHigh":
          return b.totalEstimasi - a.totalEstimasi;
        case "salaryLow":
          return a.totalEstimasi - b.totalEstimasi;
        case "golongan":
          return a.golongan.localeCompare(b.golongan);
        case "alphabetical":
          return a.pangkat.localeCompare(b.pangkat);
        default:
          return 0;
      }
    });

    setFilteredData(sorted);
  };

  const availableGolongan = Array.from(
    new Set(combinedData.map((item) => item.golongan)),
  ).sort();

  const availableKementerian = Array.from(
    new Set(
      combinedData
        .filter((item) => item.kementerian)
        .map((item) => item.kementerian!),
    ),
  ).sort();

  const availableKategori = Array.from(
    new Set(
      combinedData
        .filter((item) => item.kategori !== "base")
        .map((item) => item.kategori),
    ),
  ).sort();

  return (
    <PageWrapper
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="space-y-6">
        <SearchInterface
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          availableGolongan={availableGolongan}
          availableKementerian={availableKementerian}
          availableKategori={availableKategori}
        />

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
            className="flex items-center gap-2"
          >
            <Table className="w-4 h-4" />
            {t("viewMode.table")}
          </Button>
          <Button
            variant={viewMode === "ministry" ? "default" : "outline"}
            onClick={() => setViewMode("ministry")}
            className="flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            {t("viewMode.ministry")}
          </Button>
          <Button
            variant={viewMode === "comparison" ? "default" : "outline"}
            onClick={() => setViewMode("comparison")}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {t("viewMode.comparison")}
          </Button>
        </div>

        {/* Conditional Rendering based on view mode */}
        {viewMode === "table" && (
          <DataTable data={filteredData} locale={locale} loading={loading} />
        )}
        {viewMode === "ministry" && (
          <MinistryView data={tunjanganData} locale={locale} />
        )}
        {viewMode === "comparison" && (
          <ComparisonTool data={tunjanganData} locale={locale} />
        )}
      </div>
    </PageWrapper>
  );
}
