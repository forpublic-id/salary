"use client";

import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarChart3 } from "lucide-react";
import type { TunjanganKinerja } from "@/lib/types/salary";

interface MinistryDetailChartProps {
  data: TunjanganKinerja[];
  ministryName: string;
  locale: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
];

const CATEGORY_COLORS = {
  struktural: '#3B82F6',
  fungsional: '#10B981', 
  pelaksana: '#F59E0B'
};

export function MinistryDetailChart({ 
  data, 
  ministryName, 
  locale 
}: MinistryDetailChartProps) {
  const t = useTranslations("tunjanganKinerja");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  // Prepare data for bar chart (sorted by nominal)
  const chartData = [...data]
    .sort((a, b) => b.nominal - a.nominal)
    .map((item) => ({
      ...item,
      jabatan: item.jabatan[locale as "id" | "en"],
      shortJabatan: item.jabatan[locale as "id" | "en"].length > 20 
        ? item.jabatan[locale as "id" | "en"].substring(0, 17) + "..."
        : item.jabatan[locale as "id" | "en"],
      fill: CATEGORY_COLORS[item.kategori as keyof typeof CATEGORY_COLORS] || '#6B7280'
    }));

  // Prepare data for category breakdown pie chart
  const categoryData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([kategori, count]) => ({
    kategori: locale === "id" ? (
      kategori === "struktural" ? "Struktural" :
      kategori === "fungsional" ? "Fungsional" : "Pelaksana"
    ) : (
      kategori === "struktural" ? "Structural" :
      kategori === "fungsional" ? "Functional" : "Implementing"
    ),
    count,
    percentage: Math.round((count / data.length) * 100)
  }));

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">{data.jabatan}</p>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">{t("detail.allowanceAmount")}:</span>
              <span className="font-medium text-blue-600">{formatCurrency(data.nominal)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t("detail.category")}:</span>
              <span className="font-medium">{
                locale === "id" ? (
                  data.kategori === "struktural" ? "Struktural" :
                  data.kategori === "fungsional" ? "Fungsional" : "Pelaksana"
                ) : (
                  data.kategori === "struktural" ? "Structural" :
                  data.kategori === "fungsional" ? "Functional" : "Implementing"
                )
              }</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t("detail.eligibleGrades")}:</span>
              <span className="font-medium">{data.golongan.join(", ")}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.kategori}</p>
          <p className="text-sm text-gray-600">
            {data.count} {t("detail.positions")} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Main Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("detail.allowanceComparison")} - {ministryName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(400, data.length * 40)}>
            <BarChart 
              data={chartData} 
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                tickFormatter={formatCurrencyShort}
                fontSize={12}
              />
              <YAxis 
                type="category"
                dataKey="shortJabatan"
                width={150}
                fontSize={11}
                tick={{ textAnchor: 'end' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="nominal" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("detail.categoryBreakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ kategori, percentage }) => `${kategori}\n${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(CATEGORY_COLORS)[index]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Stats */}
        <Card>
          <CardHeader>
            <CardTitle>{t("detail.categoryStats")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(
              data.reduce((acc, item) => {
                const key = item.kategori;
                if (!acc[key]) {
                  acc[key] = {
                    count: 0,
                    total: 0,
                    min: Infinity,
                    max: 0
                  };
                }
                acc[key].count++;
                acc[key].total += item.nominal;
                acc[key].min = Math.min(acc[key].min, item.nominal);
                acc[key].max = Math.max(acc[key].max, item.nominal);
                return acc;
              }, {} as Record<string, { count: number; total: number; min: number; max: number }>)
            ).map(([kategori, stats]) => (
              <div key={kategori} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className="border-0" 
                    style={{ 
                      backgroundColor: CATEGORY_COLORS[kategori as keyof typeof CATEGORY_COLORS] + '20',
                      color: CATEGORY_COLORS[kategori as keyof typeof CATEGORY_COLORS]
                    }}
                  >
                    {locale === "id" ? (
                      kategori === "struktural" ? "Struktural" :
                      kategori === "fungsional" ? "Fungsional" : "Pelaksana"
                    ) : (
                      kategori === "struktural" ? "Structural" :
                      kategori === "fungsional" ? "Functional" : "Implementing"
                    )}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {stats.count} {t("detail.positions")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-600">{t("table.average")}</div>
                    <div className="font-semibold">
                      {formatCurrency(Math.round(stats.total / stats.count))}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">{t("detail.range")}</div>
                    <div className="font-semibold text-xs">
                      {formatCurrencyShort(stats.min)} - {formatCurrencyShort(stats.max)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}