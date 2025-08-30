"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download } from "lucide-react";

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

interface P3KClientProps {
  locale: string;
}

export function P3KClient({ locale }: P3KClientProps) {
  const t = useTranslations("p3k");

  const [p3kData, setP3kData] = useState<P3KSalary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const exportToCSV = (data: P3KSalary[]) => {
    const headers = ["Golongan", "Kualifikasi", "Gaji Pokok"];
    
    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [item.golongan, item.kualifikasi, item.gajiPokok].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "p3k-salary-data.csv");
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
          <div className="p-3 bg-green-100 rounded-lg">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              {locale === "id" ? "Total Golongan P3K" : "Total P3K Grades"}
            </p>
            <p className="text-2xl font-bold text-gray-900">{p3kData.length}</p>
            <p className="text-xs text-gray-500">
              {locale === "id" ? "Golongan tersedia" : "Available grades"}
            </p>
          </div>
        </div>
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => exportToCSV(p3kData)}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>{locale === "id" ? "Export CSV" : "Export CSV"}</span>
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
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
              ? "• P3K (Pegawai Pemerintah dengan Perjanjian Kerja) adalah pegawai pemerintah dengan kontrak kerja"
              : "• P3K (Government Employees with Work Contracts) are government employees with work contracts"}
          </p>
          <p>
            {locale === "id"
              ? "• Gaji P3K berdasarkan kualifikasi pendidikan dan pengalaman kerja"
              : "• P3K salary based on educational qualification and work experience"}
          </p>
          <p>
            {locale === "id"
              ? "• Status P3K berbeda dengan PNS dalam hal jaminan kerja dan tunjangan"
              : "• P3K status differs from PNS in terms of job security and allowances"}
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