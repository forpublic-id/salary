"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { RegionalWageCalculator } from "./RegionalWageCalculator";
import { RegionalWagesMap } from "./RegionalWagesMap";
import { RegionalWage } from "@/lib/types/salary";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calculator, Map, Table } from "lucide-react";

interface RegionalWagesViewProps {
  data: RegionalWage[];
  year: number;
}

type ViewMode = "calculator" | "map";

export function RegionalWagesView({ data, year }: RegionalWagesViewProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [viewMode, setViewMode] = useState<ViewMode>("calculator");
  const [selectedRegion, setSelectedRegion] = useState<RegionalWage | null>(null);

  const handleRegionSelect = (region: RegionalWage) => {
    setSelectedRegion(region);
    // Switch to calculator view when region is selected from map
    setViewMode("calculator");
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "id" 
              ? "Pilih Tampilan" 
              : "Choose View"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={viewMode === "calculator" ? "default" : "outline"}
              onClick={() => setViewMode("calculator")}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              {locale === "id" ? "Kalkulator" : "Calculator"}
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
              className="flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              {locale === "id" ? "Peta Sebaran" : "Distribution Map"}
            </Button>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            {viewMode === "calculator" 
              ? (locale === "id" 
                ? "Hitung dan bandingkan upah minimum regional dengan kalkulator interaktif"
                : "Calculate and compare regional minimum wages with interactive calculator")
              : (locale === "id" 
                ? "Jelajahi peta sebaran upah minimum di seluruh Indonesia"
                : "Explore minimum wage distribution map across Indonesia")
            }
          </div>
        </CardContent>
      </Card>

      {/* Content based on selected view */}
      {viewMode === "calculator" && (
        <RegionalWageCalculator 
          data={data} 
          year={year}
          preSelectedRegion={selectedRegion}
        />
      )}

      {viewMode === "map" && (
        <RegionalWagesMap 
          data={data} 
          year={year}
          onRegionSelect={handleRegionSelect}
        />
      )}

      {/* Quick Stats - always visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            {locale === "id" ? "Statistik Cepat" : "Quick Statistics"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-lg font-bold text-primary">
                {data.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {locale === "id" ? "Total Daerah" : "Total Regions"}
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {data.filter(d => d.increasePercent > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">
                {locale === "id" ? "Mengalami Kenaikan" : "Increased"}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {Math.round(data.reduce((sum, d) => sum + d.increasePercent, 0) / data.length * 100) / 100}%
              </div>
              <div className="text-sm text-muted-foreground">
                {locale === "id" ? "Rata-rata Kenaikan" : "Average Increase"}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-700">
                {new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-ID").format(
                  Math.round(data.reduce((sum, d) => sum + d.population, 0) / 1000000)
                )}M
              </div>
              <div className="text-sm text-muted-foreground">
                {locale === "id" ? "Total Populasi" : "Total Population"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}