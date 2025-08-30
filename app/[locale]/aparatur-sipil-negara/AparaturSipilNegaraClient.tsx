"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Users,
  FileText,
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

interface P3KSalary {
  id: string;
  golongan: string;
  kualifikasi: string;
  gajiPokok: number;
  description: {
    id: string;
    en: string;
  };
}

interface AparaturSipilNegaraClientProps {
  locale: string;
}

export function AparaturSipilNegaraClient({
  locale,
}: AparaturSipilNegaraClientProps) {
  const t = useTranslations("aparatur");

  const [asnData, setAsnData] = useState<SalaryGolonganLengkap[]>([]);
  const [p3kData, setP3kData] = useState<P3KSalary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pns" | "p3k">("pns");

  // Filter states
  const [selectedGolongan, setSelectedGolongan] = useState<string>("all");
  const [selectedMasaKerja, setSelectedMasaKerja] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch PNS data
        const pnsRes = await fetch("/data/salary/pns/golongan-benar.json");
        const pnsData = await pnsRes.json();
        setAsnData(pnsData.golongan || []);

        // P3K data (mock data for now - can be replaced with real data file)
        const mockP3KData: P3KSalary[] = [
          {
            id: "p3k-1",
            golongan: "I",
            kualifikasi: "SMA/SMK",
            gajiPokok: 1500000,
            description: {
              id: "P3K Golongan I - Kualifikasi SMA/SMK",
              en: "P3K Grade I - High School Qualification",
            },
          },
          {
            id: "p3k-2",
            golongan: "II",
            kualifikasi: "D3",
            gajiPokok: 1800000,
            description: {
              id: "P3K Golongan II - Kualifikasi D3",
              en: "P3K Grade II - Diploma Qualification",
            },
          },
          {
            id: "p3k-3",
            golongan: "III",
            kualifikasi: "S1",
            gajiPokok: 2200000,
            description: {
              id: "P3K Golongan III - Kualifikasi S1",
              en: "P3K Grade III - Bachelor's Degree Qualification",
            },
          },
          {
            id: "p3k-4",
            golongan: "IV",
            kualifikasi: "S2",
            gajiPokok: 2800000,
            description: {
              id: "P3K Golongan IV - Kualifikasi S2",
              en: "P3K Grade IV - Master's Degree Qualification",
            },
          },
        ];
        setP3kData(mockP3KData);
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

  const exportToCSV = (data: any[], filename: string) => {
    const headers =
      activeTab === "pns"
        ? ["Golongan", "Pangkat", "Masa Kerja", "Gaji Pokok"]
        : ["Golongan", "Kualifikasi", "Gaji Pokok"];

    let csvContent;
    if (activeTab === "pns") {
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
      csvContent = [headers.join(","), ...asnRows].join("\n");
    } else {
      csvContent = [
        headers.join(","),
        ...data.map((item) =>
          [item.golongan, item.kualifikasi, item.gajiPokok].join(","),
        ),
      ].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {locale === "id" ? "Total PNS" : "Total PNS"}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activeTab === "pns"
                  ? getFilteredData().length
                  : asnData.length}
              </p>
              <p className="text-xs text-gray-500">
                {locale === "id" ? "Golongan tersedia" : "Available grades"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {locale === "id" ? "Total P3K" : "Total P3K"}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {p3kData.length}
              </p>
              <p className="text-xs text-gray-500">
                {locale === "id" ? "Golongan tersedia" : "Available grades"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("pns")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pns"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {locale === "id"
              ? "PNS (Pegawai Negeri Sipil)"
              : "PNS (Civil Servants)"}
          </button>
          <button
            onClick={() => setActiveTab("p3k")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "p3k"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {locale === "id"
              ? "P3K (Pegawai Pemerintah dengan Perjanjian Kerja)"
              : "P3K (Government Employees with Work Contracts)"}
          </button>
        </nav>
      </div>

      {/* Filters and Export */}
      {activeTab === "pns" && (
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
              onClick={() =>
                exportToCSV(
                  activeTab === "pns" ? getFilteredData() : p3kData,
                  `${activeTab}-salary-data.csv`,
                )
              }
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{locale === "id" ? "Export CSV" : "Export CSV"}</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
          {activeTab === "pns" ? (
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
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === "id" ? "Golongan" : "Grade"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === "id" ? "Kualifikasi" : "Qualification"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === "id" ? "Gaji Pokok" : "Basic Salary"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {p3kData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.golongan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.kualifikasi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(item.gajiPokok)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
              ? "• ASN = PNS + P3K (Aparatur Sipil Negara terdiri dari PNS dan P3K)"
              : "• ASN = PNS + P3K (Civil State Apparatus consists of PNS and P3K)"}
          </p>
          <p>
            {locale === "id"
              ? "• Data P3K masih menggunakan contoh/mock data"
              : "• P3K data is still using sample/mock data"}
          </p>
        </div>
      </Card>
    </div>
  );
}
