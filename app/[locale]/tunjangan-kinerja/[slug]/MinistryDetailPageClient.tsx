"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MinistryDetailTable } from "@/components/salary/MinistryDetailTable";
import { MinistryDetailChart } from "@/components/salary/MinistryDetailChart";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  ArrowLeft,
  Building2,
  Users,
  TrendingUp,
  FileText,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import type { TunjanganKinerja } from "@/lib/types/salary";

interface MinistryData {
  kementerian: string;
  kode: string;
  positions: TunjanganKinerja[];
  stats: {
    totalPositions: number;
    median: number;
    lowest: number;
    highest: number;
    average: number;
  };
  regulations: Array<{
    title: string;
    url: string;
  }>;
}

interface MinistryDetailPageClientProps {
  locale: string;
  slug: string;
}

export default function MinistryDetailPageClient({
  locale,
  slug,
}: MinistryDetailPageClientProps) {
  const t = useTranslations("tunjanganKinerja");
  const [ministryData, setMinistryData] = useState<MinistryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchMinistryData = async () => {
      try {
        const response = await fetch("/data/salary/pns/tunjangan-kinerja.json");
        const data = await response.json();

        // Find positions for this ministry by matching slug to kode
        const ministryPositions = data.tunjanganKinerja.filter(
          (item: TunjanganKinerja) =>
            item.kode.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug,
        );

        if (ministryPositions.length === 0) {
          setLoading(false);
          return;
        }

        const firstPosition = ministryPositions[0];
        const nominals = ministryPositions
          .map((pos: TunjanganKinerja) => pos.nominal)
          .sort((a: number, b: number) => a - b);
        const sum = nominals.reduce((acc: number, val: number) => acc + val, 0);

        // Collect all regulations
        const allRegulations = new Set();
        ministryPositions.forEach((pos: TunjanganKinerja) => {
          if (pos.regulations) {
            pos.regulations.forEach((reg) =>
              allRegulations.add(JSON.stringify(reg)),
            );
          } else {
            allRegulations.add(
              JSON.stringify({
                title: `PMK ${pos.kode} 2024`,
                url: `/docs/regulations/pmk-${pos.kode.toLowerCase()}-2024.pdf`,
              }),
            );
          }
        });

        const ministry: MinistryData = {
          kementerian: firstPosition.kementerian[locale as "id" | "en"],
          kode: firstPosition.kode,
          positions: ministryPositions,
          stats: {
            totalPositions: ministryPositions.length,
            median: nominals[Math.floor(nominals.length / 2)],
            lowest: nominals[0],
            highest: nominals[nominals.length - 1],
            average: Math.round(sum / nominals.length),
          },
          regulations: Array.from(allRegulations).map((reg) =>
            JSON.parse(reg as string),
          ),
        };

        setMinistryData(ministry);
      } catch (error) {
        console.error("Error fetching ministry data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistryData();
  }, [locale, slug]);

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

  if (!ministryData) {
    return (
      <PageLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("detail.notFound")}
          </h1>
          <Link href={`/${locale}/tunjangan-kinerja`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("detail.backToList")}
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href={`/${locale}/tunjangan-kinerja`}
            className="hover:text-foreground transition-colors"
          >
            {t("title")}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {ministryData.kementerian}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {ministryData.kementerian}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{ministryData.kode}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {ministryData.stats.totalPositions} {t("detail.positions")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/${locale}/tunjangan-kinerja`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("detail.backToList")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("detail.totalPositions")}
                  </p>
                  <p className="text-2xl font-bold">
                    {ministryData.stats.totalPositions}
                  </p>
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
                    {t("table.median")}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(ministryData.stats.median)}
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
                    {t("detail.range")}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(ministryData.stats.lowest)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    - {formatCurrency(ministryData.stats.highest)}
                  </p>
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
                    {t("table.average")}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(ministryData.stats.average)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regulations */}
        {ministryData.regulations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("detail.regulations")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ministryData.regulations.map((regulation, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-8"
                    asChild
                  >
                    <a
                      href={regulation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {regulation.title}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={!showChart ? "default" : "outline"}
            onClick={() => setShowChart(false)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {t("detail.tableView")}
          </Button>
          <Button
            variant={showChart ? "default" : "outline"}
            onClick={() => setShowChart(true)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {t("detail.chartView")}
          </Button>
        </div>

        {/* Main Content */}
        {!showChart ? (
          <MinistryDetailTable data={ministryData.positions} locale={locale} />
        ) : (
          <MinistryDetailChart
            data={ministryData.positions}
            ministryName={ministryData.kementerian}
            locale={locale}
          />
        )}
      </div>
    </PageLayout>
  );
}
