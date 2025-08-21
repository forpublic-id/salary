"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { SalaryGolongan, TunjanganKinerja } from "@/lib/types/salary";

interface SalaryChartsProps {
  golonganData: SalaryGolongan[];
  tunjanganData: TunjanganKinerja[];
  locale: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

export function SalaryCharts({
  golonganData,
  tunjanganData,
  locale,
}: SalaryChartsProps) {
  const t = useTranslations("analysis");
  const tCommon = useTranslations("common");

  const salaryByGradeData = useMemo(() => {
    return golonganData.map((golongan) => ({
      grade: golongan.golongan,
      salary: golongan.gajiPokok,
      rank: golongan.pangkat,
    }));
  }, [golonganData]);

  const salaryDistribution = useMemo(() => {
    const ranges = [
      { range: "< 2M", min: 0, max: 2000000 },
      { range: "2-3M", min: 2000000, max: 3000000 },
      { range: "3-4M", min: 3000000, max: 4000000 },
      { range: "4-5M", min: 4000000, max: 5000000 },
      { range: "> 5M", min: 5000000, max: Infinity },
    ];

    return ranges.map((range) => ({
      range: range.range,
      count: golonganData.filter(
        (g) => g.gajiPokok >= range.min && g.gajiPokok < range.max,
      ).length,
    }));
  }, [golonganData]);

  const ministryComparison = useMemo(() => {
    const ministryAverage: { [key: string]: { total: number; count: number } } =
      {};

    tunjanganData.forEach((tunjangan) => {
      const ministry = tunjangan.kementerian[locale as "id" | "en"];
      if (!ministryAverage[ministry]) {
        ministryAverage[ministry] = { total: 0, count: 0 };
      }
      ministryAverage[ministry].total += tunjangan.nominal;
      ministryAverage[ministry].count += 1;
    });

    return Object.entries(ministryAverage)
      .map(([ministry, data]) => ({
        ministry:
          ministry.length > 25 ? ministry.slice(0, 25) + "..." : ministry,
        fullName: ministry,
        averageAllowance: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.averageAllowance - a.averageAllowance)
      .slice(0, 8); // Top 8 ministries
  }, [tunjanganData, locale]);

  const allowanceByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {};

    tunjanganData.forEach((tunjangan) => {
      categories[tunjangan.kategori] =
        (categories[tunjangan.kategori] || 0) + tunjangan.nominal;
    });

    return Object.entries(categories).map(([category, total]) => ({
      category: category,
      total: total,
    }));
  }, [tunjanganData]);

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value, locale);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatTooltipValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Salary by Grade Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.salaryByGrade")}</CardTitle>
          <CardDescription>
            Base salary amounts by civil service grade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={salaryByGradeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="salary" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salary Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.salaryDistribution")}</CardTitle>
            <CardDescription>
              Distribution of salaries across different ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salaryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {salaryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Allowance by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Allowance by Category</CardTitle>
            <CardDescription>
              Total allowances by position category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allowanceByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, total }) =>
                    `${category}: ${(total / 1000000000).toFixed(1)}B`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {allowanceByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatTooltipValue(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ministry Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.ministryComparison")}</CardTitle>
          <CardDescription>
            Average performance allowance by ministry/agency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ministryComparison}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <YAxis dataKey="ministry" type="category" width={80} />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  formatTooltipValue(value),
                  `Average Allowance`,
                ]}
                labelFormatter={(label: string, payload: any) =>
                  payload?.[0]?.payload?.fullName || label
                }
              />
              <Bar dataKey="averageAllowance" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{golonganData.length}</div>
            <p className="text-xs text-muted-foreground">Total Grades</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {formatCurrency(
                Math.round(
                  golonganData.reduce((sum, g) => sum + g.gajiPokok, 0) /
                    golonganData.length,
                ),
                locale,
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {tCommon("average")} Base Salary
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {formatCurrency(
                Math.max(...golonganData.map((g) => g.gajiPokok)),
                locale,
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {tCommon("maximum")} Base Salary
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{tunjanganData.length}</div>
            <p className="text-xs text-muted-foreground">
              Performance Positions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
