"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Download,
  ChevronDown,
  ChevronRight,
  Filter,
} from "lucide-react";

interface SalaryGolonganLengkap {
  id: string;
  golongan: string;
  pangkat: string;
  description: {
    id: string;
    en: string;
  };
  gajiPokok: {
    masaKerja: number;
    gaji: number;
  }[];
}

interface PNSClientProps {
  locale: string;
}

export function PNSClient({ locale }: PNSClientProps) {
  const t = useTranslations("pns");

  const [asnData, setAsnData] = useState<SalaryGolonganLengkap[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedGolongan, setSelectedGolongan] = useState<string>("all");
  const [selectedMasaKerja, setSelectedMasaKerja] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pnsRes = await fetch("/data/salary/pns/golongan-benar.json");
        const pnsData = await pnsRes.json();
        setAsnData(pnsData.golongan || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get unique golongan options
  const getGolonganOptions = () => {
    const golonganSet = new Set<string>();
    asnData.forEach((item) => {
      const golonganGroup = item.golongan.split("/")[0]; // I, II, III, IV
      golonganSet.add(golonganGroup);
    });
    return Array.from(golonganSet).sort();
  };

  // Get unique masa kerja options
  const getMasaKerjaOptions = () => {
    const masaKerjaSet = new Set<number>();
    asnData.forEach((item) => {
      item.gajiPokok.forEach((salary) => {
        masaKerjaSet.add(salary.masaKerja);
      });
    });
    return Array.from(masaKerjaSet).sort((a, b) => a - b);
  };

  // Filter data based on selected filters
  const getFilteredData = () => {
    return asnData.filter((item) => {
      const golonganGroup = item.golongan.split("/")[0];
      const golonganMatch =
        selectedGolongan === "all" || golonganGroup === selectedGolongan;

      if (selectedMasaKerja === "all") {
        return golonganMatch;
      }

      const masaKerjaMatch = item.gajiPokok.some(
        (salary) => salary.masaKerja.toString() === selectedMasaKerja,
      );

      return golonganMatch && masaKerjaMatch;
    });
  };

  // Toggle expanded row
  const toggleExpandedRow = (itemId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedRows(newExpanded);
  };

  // Get salary range for an item
  const getSalaryRange = (item: SalaryGolonganLengkap) => {
    const salaries = item.gajiPokok.map((s) => s.gaji);
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    return { min, max };
  };

  const exportToCSV = (data: SalaryGolonganLengkap[]) => {
    const headers = ["Golongan", "Pangkat", "Masa Kerja", "Gaji Pokok"];

    const asnRows: string[] = [];
    data.forEach((item) => {
      item.gajiPokok.forEach(
        (salary: { masaKerja: number; gaji: number }) => {
          asnRows.push(
            [item.golongan, item.pangkat, salary.masaKerja, salary.gaji].join(
              ",",
            ),
          );
        },
      );
    });

    const csvContent = [headers.join(","), ...asnRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "pns-salary-data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              {locale === "id" ? "Total Golongan PNS" : "Total PNS Grades"}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {getFilteredData().length}
            </p>
            <p className="text-xs text-gray-500">
              {locale === "id" ? "Golongan tersedia" : "Available grades"}
            </p>
          </div>
        </div>
      </Card>

      {/* Filters and Export */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {locale === "id" ? "Filter:" : "Filter:"}
              </span>
            </div>

            <select
              value={selectedGolongan}
              onChange={(e) => setSelectedGolongan(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                {locale === "id" ? "Semua Golongan" : "All Grades"}
              </option>
              {getGolonganOptions().map((option) => (
                <option key={option} value={option}>
                  {locale === "id" ? `Golongan ${option}` : `Grade ${option}`}
                </option>
              ))}
            </select>

            <select
              value={selectedMasaKerja}
              onChange={(e) => setSelectedMasaKerja(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                {locale === "id"
                  ? "Semua Masa Kerja"
                  : "All Years of Service"}
              </option>
              {getMasaKerjaOptions().map((option) => (
                <option key={option} value={option.toString()}>
                  {option} {locale === "id" ? "tahun" : "years"}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const allIds = new Set(
                    getFilteredData().map((item) => item.id),
                  );
                  setExpandedRows(allIds);
                }}
                className="px-3 py-2 text-xs text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50"
              >
                {locale === "id" ? "Buka Semua" : "Expand All"}
              </button>

              <button
                onClick={() => {
                  setExpandedRows(new Set());
                }}
                className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {locale === "id" ? "Tutup Semua" : "Collapse All"}
              </button>

              <button
                onClick={() => {
                  setSelectedGolongan("all");
                  setSelectedMasaKerja("all");
                  setExpandedRows(new Set());
                }}
                className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {locale === "id" ? "Reset" : "Reset"}
              </button>
            </div>
          </div>

          <Button
            onClick={() => exportToCSV(getFilteredData())}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{locale === "id" ? "Export CSV" : "Export CSV"}</span>
          </Button>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <div className="space-y-4">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              <div>{locale === "id" ? "Golongan" : "Grade"}</div>
              <div>{locale === "id" ? "Pangkat" : "Rank"}</div>
              <div>{locale === "id" ? "Rentang Gaji" : "Salary Range"}</div>
              <div>{locale === "id" ? "Detail" : "Details"}</div>
            </div>

            <div className="space-y-2">
              {getFilteredData().map((item) => {
                const { min, max } = getSalaryRange(item);
                const isExpanded = expandedRows.has(item.id);

                // Filter salaries based on masa kerja filter
                let displayedSalaries = item.gajiPokok;
                if (selectedMasaKerja !== "all") {
                  displayedSalaries = item.gajiPokok.filter(
                    (s) => s.masaKerja.toString() === selectedMasaKerja,
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg"
                  >
                    {/* Header Row - Always Visible */}
                    <div
                      className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpandedRow(item.id)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <button className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <span className="font-medium text-gray-900">
                              {item.golongan}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              {item.pangkat}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedMasaKerja !== "all" &&
                              displayedSalaries.length === 1
                                ? formatCurrency(displayedSalaries[0].gaji)
                                : `${formatCurrency(min)} - ${formatCurrency(max)}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">
                              {selectedMasaKerja !== "all" &&
                              displayedSalaries.length === 1
                                ? `${displayedSalaries[0].masaKerja} ${locale === "id" ? "tahun" : "years"}`
                                : `${item.gajiPokok.length} ${locale === "id" ? "tingkatan" : "levels"}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t bg-gray-50">
                        <div className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {displayedSalaries.map((salary, index) => (
                              <div
                                key={index}
                                className="bg-white p-3 rounded border flex justify-between items-center"
                              >
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatCurrency(salary.gaji)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {locale === "id"
                                      ? "Gaji Pokok"
                                      : "Basic Salary"}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-blue-600">
                                    {salary.masaKerja}{" "}
                                    {locale === "id" ? "thn" : "yrs"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {locale === "id"
                                      ? "Masa Kerja"
                                      : "Experience"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {getFilteredData().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {locale === "id"
                    ? "Tidak ada data yang sesuai dengan filter"
                    : "No data matches the filter"}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Information Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {locale === "id" ? "Informasi Penting" : "Important Information"}
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            {locale === "id"
              ? "• Gaji pokok PNS berdasarkan PP No. 5/2024 - setiap golongan mulai dari masa kerja 0 tahun"
              : "• PNS basic salary based on Government Regulation No. 5/2024 - each grade starts from 0 years of service"}
          </p>
          <p>
            {locale === "id"
              ? "• Kenaikan gaji berkala setiap 2 tahun untuk masa kerja awal, lalu setiap tahun"
              : "• Regular salary increases every 2 years for early service, then annually"}
          </p>
          <p>
            {locale === "id"
              ? "• PNS (Pegawai Negeri Sipil) adalah pegawai tetap pemerintah dengan status kepegawaian penuh"
              : "• PNS (Civil Servants) are permanent government employees with full employment status"}
          </p>
        </div>
      </Card>
    </div>
  );
}