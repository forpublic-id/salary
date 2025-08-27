"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { X, Plus, ArrowUpDown } from "lucide-react";
import type { TunjanganKinerja } from "@/lib/types/salary";

interface ComparisonToolProps {
  data: TunjanganKinerja[];
  locale: string;
}

interface ComparisonItem {
  id: string;
  tunjangan: TunjanganKinerja;
}

export function ComparisonTool({ data, locale }: ComparisonToolProps) {
  const t = useTranslations("browse");
  const tCommon = useTranslations("common");

  const [selectedItems, setSelectedItems] = useState<ComparisonItem[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const addToComparison = (tunjangan: TunjanganKinerja) => {
    if (
      selectedItems.length < 4 &&
      !selectedItems.some((item) => item.id === tunjangan.id)
    ) {
      setSelectedItems([...selectedItems, { id: tunjangan.id, tunjangan }]);
    }
  };

  const removeFromComparison = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const clearComparison = () => {
    setSelectedItems([]);
  };

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

  const getComparisonStats = () => {
    if (selectedItems.length === 0) return null;

    const amounts = selectedItems.map((item) => item.tunjangan.nominal);
    const highest = Math.max(...amounts);
    const lowest = Math.min(...amounts);
    const average = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;

    return {
      highest,
      lowest,
      average,
      range: highest - lowest,
      highestItem: selectedItems.find(
        (item) => item.tunjangan.nominal === highest,
      ),
      lowestItem: selectedItems.find(
        (item) => item.tunjangan.nominal === lowest,
      ),
    };
  };

  const stats = getComparisonStats();

  if (selectedItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            {t("comparison.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {t("comparison.empty")}
            </p>
            <Button onClick={() => setShowSelector(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t("comparison.addPosition")}
            </Button>
          </div>

          {showSelector && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <Label className="text-sm font-medium mb-2 block">
                {t("comparison.selectPosition")}
              </Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => {
                    const tunjangan = data.find((item) => item.id === value);
                    if (tunjangan) {
                      addToComparison(tunjangan);
                      setShowSelector(false);
                    }
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue
                      placeholder={t("comparison.choosePlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {data
                      .filter(
                        (item) =>
                          !selectedItems.some(
                            (selected) => selected.id === item.id,
                          ),
                      )
                      .map((tunjangan) => (
                        <SelectItem key={tunjangan.id} value={tunjangan.id}>
                          {tunjangan.kementerian[locale as "id" | "en"]} -{" "}
                          {tunjangan.jabatan[locale as "id" | "en"]} (
                          {formatCurrency(tunjangan.nominal)})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowSelector(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            {t("comparison.title")} ({selectedItems.length}/4)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSelector(true)}
              disabled={selectedItems.length >= 4}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("comparison.add")}
            </Button>
            <Button variant="outline" size="sm" onClick={clearComparison}>
              {t("comparison.clear")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Comparison Statistics */}
        {stats && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">{t("comparison.statistics")}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">
                  {t("comparison.highest")}
                </div>
                <div className="font-semibold">
                  {formatCurrency(stats.highest)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {
                    stats.highestItem?.tunjangan.kementerian[
                      locale as "id" | "en"
                    ]
                  }
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  {t("comparison.lowest")}
                </div>
                <div className="font-semibold">
                  {formatCurrency(stats.lowest)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {
                    stats.lowestItem?.tunjangan.kementerian[
                      locale as "id" | "en"
                    ]
                  }
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  {t("comparison.average")}
                </div>
                <div className="font-semibold">
                  {formatCurrency(stats.average)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  {t("comparison.range")}
                </div>
                <div className="font-semibold">
                  {formatCurrency(stats.range)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="relative border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 p-1 h-auto"
                onClick={() => removeFromComparison(item.id)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={`text-xs ${getCategoryColor(item.tunjangan.kategori)}`}
                  >
                    {item.tunjangan.kategori}
                  </Badge>
                </div>

                <h4 className="font-medium mb-1">
                  {item.tunjangan.jabatan[locale as "id" | "en"]}
                </h4>

                <p className="text-sm text-muted-foreground mb-2">
                  {item.tunjangan.kementerian[locale as "id" | "en"]}
                </p>

                <div className="text-lg font-semibold text-primary mb-2">
                  {formatCurrency(item.tunjangan.nominal)}
                </div>

                <div className="text-sm text-muted-foreground">
                  {t("comparison.eligibleGrades")}:{" "}
                  {item.tunjangan.golongan.join(", ")}
                </div>

                {/* Percentage comparison */}
                {stats && selectedItems.length > 1 && (
                  <div className="mt-2 text-sm">
                    {item.tunjangan.nominal === stats.highest && (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        {t("comparison.highestBadge")}
                      </Badge>
                    )}
                    {item.tunjangan.nominal === stats.lowest && (
                      <Badge
                        variant="default"
                        className="bg-red-100 text-red-800"
                      >
                        {t("comparison.lowestBadge")}
                      </Badge>
                    )}
                    {item.tunjangan.nominal !== stats.highest &&
                      item.tunjangan.nominal !== stats.lowest && (
                        <div className="text-muted-foreground">
                          {(
                            (item.tunjangan.nominal / stats.average - 1) *
                            100
                          ).toFixed(1)}
                          % vs average
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Position Selector */}
        {showSelector && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <Label className="text-sm font-medium mb-2 block">
              {t("comparison.selectPosition")}
            </Label>
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => {
                  const tunjangan = data.find((item) => item.id === value);
                  if (tunjangan) {
                    addToComparison(tunjangan);
                    setShowSelector(false);
                  }
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={t("comparison.choosePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {data
                    .filter(
                      (item) =>
                        !selectedItems.some(
                          (selected) => selected.id === item.id,
                        ),
                    )
                    .map((tunjangan) => (
                      <SelectItem key={tunjangan.id} value={tunjangan.id}>
                        {tunjangan.kementerian[locale as "id" | "en"]} -{" "}
                        {tunjangan.jabatan[locale as "id" | "en"]} (
                        {formatCurrency(tunjangan.nominal)})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setShowSelector(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
