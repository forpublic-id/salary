"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

interface MinistryStats {
  kementerian: string;
  kode: string;
  median: number;
  lowest: number;
  highest: number;
  average: number;
  count: number;
  regulations: string[];
}

interface TunjanganKinerjaChartProps {
  data: MinistryStats[];
  locale: string;
}

type ChartType = "bar" | "pie" | "comparison";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
];

export function TunjanganKinerjaChart({
  data,
  locale,
}: TunjanganKinerjaChartProps) {
  const t = useTranslations("tunjanganKinerja");
  const [chartType, setChartType] = useState<ChartType>("bar");

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

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">{t("chart.median")}:</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(data.median)}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t("chart.average")}:</span>
              <span className="font-medium">
                {formatCurrency(data.average)}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t("chart.range")}:</span>
              <span className="font-medium">
                {formatCurrencyShort(data.lowest)} -{" "}
                {formatCurrencyShort(data.highest)}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t("chart.positions")}:</span>
              <span className="font-medium">{data.count}</span>
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
          <p className="font-semibold text-gray-900">{data.kementerian}</p>
          <p className="text-sm text-gray-600">
            {t("chart.median")}: {formatCurrency(data.median)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="kode"
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis tickFormatter={formatCurrencyShort} fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="median" fill="#3B82F6" name={t("chart.median")} />
        <Bar dataKey="average" fill="#10B981" name={t("chart.average")} />
        <Bar dataKey="highest" fill="#F59E0B" name={t("chart.highest")} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ kode, percent }) =>
            `${kode} ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={150}
          fill="#8884d8"
          dataKey="median"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<PieTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderComparisonChart = () => {
    const comparisonData = data.map((item) => ({
      ...item,
      range: item.highest - item.lowest,
    }));

    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={comparisonData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="kode"
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis tickFormatter={formatCurrencyShort} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="lowest"
            stackId="a"
            fill="#EF4444"
            name={t("chart.lowest")}
          />
          <Bar
            dataKey="range"
            stackId="a"
            fill="#3B82F6"
            name={t("chart.range")}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={chartType === "bar" ? "default" : "outline"}
          onClick={() => setChartType("bar")}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {t("chartTypes.comparison")}
        </Button>
        <Button
          variant={chartType === "pie" ? "default" : "outline"}
          onClick={() => setChartType("pie")}
          className="flex items-center gap-2"
        >
          <PieChartIcon className="h-4 w-4" />
          {t("chartTypes.distribution")}
        </Button>
        <Button
          variant={chartType === "comparison" ? "default" : "outline"}
          onClick={() => setChartType("comparison")}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          {t("chartTypes.range")}
        </Button>
      </div>

      {/* Chart Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {chartType === "bar" && <BarChart3 className="h-5 w-5" />}
            {chartType === "pie" && <PieChartIcon className="h-5 w-5" />}
            {chartType === "comparison" && <TrendingUp className="h-5 w-5" />}

            {chartType === "bar" && t("charts.comparisonTitle")}
            {chartType === "pie" && t("charts.distributionTitle")}
            {chartType === "comparison" && t("charts.rangeTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartType === "bar" && renderBarChart()}
          {chartType === "pie" && renderPieChart()}
          {chartType === "comparison" && renderComparisonChart()}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(Math.max(...data.map((d) => d.highest)))}
              </p>
              <p className="text-sm text-gray-600">
                {t("stats.highestAllowance")}
              </p>
              <Badge variant="secondary" className="mt-2">
                {
                  data.find(
                    (d) =>
                      d.highest === Math.max(...data.map((d) => d.highest)),
                  )?.kode
                }
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  Math.round(
                    data.reduce((acc, d) => acc + d.median, 0) / data.length,
                  ),
                )}
              </p>
              <p className="text-sm text-gray-600">
                {t("stats.medianAllowance")}
              </p>
              <Badge variant="secondary" className="mt-2">
                {t("stats.overallMedian")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {data.reduce((acc, d) => acc + d.count, 0)}
              </p>
              <p className="text-sm text-gray-600">
                {t("stats.totalPositions")}
              </p>
              <Badge variant="secondary" className="mt-2">
                {data.length} {t("stats.ministries")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
