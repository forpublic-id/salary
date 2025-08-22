"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { TunjanganKinerja } from "@/lib/types/salary";

interface MinistryViewProps {
  data: TunjanganKinerja[];
  locale: string;
}

interface MinistryGroup {
  kementerian: string;
  positions: TunjanganKinerja[];
  totalPositions: number;
  averageAllowance: number;
  minAllowance: number;
  maxAllowance: number;
}

export function MinistryView({ data, locale }: MinistryViewProps) {
  const t = useTranslations("browse");
  const tCommon = useTranslations("common");

  // Group data by ministry
  const ministryGroups: MinistryGroup[] = Object.entries(
    data.reduce(
      (acc, item) => {
        const ministryName = item.kementerian[locale as "id" | "en"];
        if (!acc[ministryName]) {
          acc[ministryName] = [];
        }
        acc[ministryName].push(item);
        return acc;
      },
      {} as Record<string, TunjanganKinerja[]>,
    ),
  ).map(([kementerian, positions]) => {
    const allowances = positions.map((p) => p.nominal);
    return {
      kementerian,
      positions,
      totalPositions: positions.length,
      averageAllowance: allowances.reduce((sum, val) => sum + val, 0) / allowances.length,
      minAllowance: Math.min(...allowances),
      maxAllowance: Math.max(...allowances),
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "struktural":
        return "bg-blue-100 text-blue-800";
      case "fungsional":
        return "bg-green-100 text-green-800";
      case "pelaksana":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {ministryGroups.map((ministry) => (
          <Card key={ministry.kementerian} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{ministry.kementerian}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ministry.totalPositions} {t("ministryView.positions")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {t("ministryView.averageAllowance")}
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(ministry.averageAllowance)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Ministry Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {t("ministryView.minAllowance")}
                  </div>
                  <div className="font-semibold">{formatCurrency(ministry.minAllowance)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {t("ministryView.maxAllowance")}
                  </div>
                  <div className="font-semibold">{formatCurrency(ministry.maxAllowance)}</div>
                </div>
                <div className="text-center col-span-2 md:col-span-1">
                  <div className="text-sm text-muted-foreground">
                    {t("ministryView.range")}
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(ministry.maxAllowance - ministry.minAllowance)}
                  </div>
                </div>
              </div>

              {/* Positions List */}
              <div className="space-y-3">
                {ministry.positions
                  .sort((a, b) => b.nominal - a.nominal)
                  .map((position) => (
                    <div
                      key={position.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">
                            {position.jabatan[locale as "id" | "en"]}
                          </h4>
                          <Badge
                            className={`text-xs ${getCategoryColor(position.kategori)}`}
                          >
                            {position.kategori}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("ministryView.eligibleGrades")}: {position.golongan.join(", ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {formatCurrency(position.nominal)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("ministryView.monthlyAllowance")}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}