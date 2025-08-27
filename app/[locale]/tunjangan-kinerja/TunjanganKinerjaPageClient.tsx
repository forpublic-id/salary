"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { TunjanganKinerjaTable } from "@/components/salary/TunjanganKinerjaTable";
import { TunjanganKinerjaChart } from "@/components/salary/TunjanganKinerjaChart";
import { Building2, BarChart3, FileText, TrendingUp } from "lucide-react";
import type { TunjanganKinerja } from "@/lib/types/salary";

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

interface TunjanganKinerjaPageClientProps {
  locale: string;
}

export default function TunjanganKinerjaPageClient({
  locale,
}: TunjanganKinerjaPageClientProps) {
  const t = useTranslations("tunjanganKinerja");

  const [tunjanganData, setTunjanganData] = useState<TunjanganKinerja[]>([]);
  const [ministryStats, setMinistryStats] = useState<MinistryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/salary/pns/tunjangan-kinerja.json");
        const data = await response.json();

        setTunjanganData(data.tunjanganKinerja);

        // Calculate ministry statistics
        const ministryMap = new Map<string, TunjanganKinerja[]>();

        data.tunjanganKinerja.forEach((item: TunjanganKinerja) => {
          const key = item.kementerian[locale as "id" | "en"];
          if (!ministryMap.has(key)) {
            ministryMap.set(key, []);
          }
          ministryMap.get(key)!.push(item);
        });

        const stats: MinistryStats[] = Array.from(ministryMap.entries())
          .map(([kementerian, items]) => {
            const nominals = items
              .map((item) => item.nominal)
              .sort((a, b) => a - b);
            const sum = nominals.reduce((acc, val) => acc + val, 0);

            // Collect all unique regulations from items
            const allRegulations = new Set<string>();
            items.forEach((item) => {
              if (item.regulations) {
                item.regulations.forEach((reg) =>
                  allRegulations.add(reg.title),
                );
              } else {
                allRegulations.add(`PMK ${item.kode} 2024`);
              }
            });

            return {
              kementerian,
              kode: items[0].kode,
              median: nominals[Math.floor(nominals.length / 2)],
              lowest: nominals[0],
              highest: nominals[nominals.length - 1],
              average: Math.round(sum / nominals.length),
              count: items.length,
              regulations: Array.from(allRegulations),
            };
          })
          .sort((a, b) => b.median - a.median);

        setMinistryStats(stats);
      } catch (error) {
        console.error("Error fetching tunjangan kinerja data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("stats.totalMinistries")}
                  </p>
                  <p className="text-2xl font-bold">{ministryStats.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("stats.totalPositions")}
                  </p>
                  <p className="text-2xl font-bold">{tunjanganData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("stats.highestAllowance")}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      Math.max(...ministryStats.map((s) => s.highest)),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("stats.averageAllowance")}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      Math.round(
                        ministryStats.reduce((acc, s) => acc + s.average, 0) /
                          ministryStats.length,
                      ),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="institutions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="institutions"
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              {t("tabs.institutions")}
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("tabs.comparison")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="institutions" className="space-y-4">
            <TunjanganKinerjaTable data={ministryStats} locale={locale} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <TunjanganKinerjaChart data={ministryStats} locale={locale} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
