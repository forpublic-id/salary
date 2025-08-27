"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { MapPin, TrendingUp, Calculator, Users } from "lucide-react";
import { RegionalWage, WageCalculation } from "@/lib/types/salary";

interface RegionalWageCalculatorProps {
  data: RegionalWage[];
  year: number;
  preSelectedRegion?: RegionalWage | null;
}

export function RegionalWageCalculator({
  data,
  year,
  preSelectedRegion,
}: RegionalWageCalculatorProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedRegion, setSelectedRegion] = useState<RegionalWage | null>(
    preSelectedRegion || null,
  );
  const [calculation, setCalculation] = useState<WageCalculation | null>(null);

  const provinces = Array.from(
    new Set(data.map((item) => item.province.id)),
  ).sort();
  const [selectedProvince, setSelectedProvince] = useState<string>(
    preSelectedRegion?.province.id || ""
  );

  const availableCities = selectedProvince
    ? data
        .filter((item) => item.province.id === selectedProvince)
        .sort((a, b) => a.city.id.localeCompare(b.city.id))
    : [];

  const calculateWage = (region: RegionalWage): WageCalculation => {
    const monthlyWage = region.umr;
    const dailyWage = monthlyWage / 30;
    const hourlyWage = dailyWage / 8;
    const annualWage = monthlyWage * 12;

    // Cost of living multiplier (Jakarta = 1.0)
    const costMultipliers = {
      very_low: 0.6,
      low: 0.7,
      medium: 0.8,
      medium_high: 0.9,
      high: 1.1,
      very_high: 1.0,
    };

    const costOfLivingAdjusted =
      monthlyWage / costMultipliers[region.costOfLiving];

    // Jakarta comparison
    const jakartaWage =
      data.find((item) => item.id === "dki-jakarta")?.umr || monthlyWage;
    const comparisonWithJakarta = {
      percentage: (monthlyWage / jakartaWage) * 100,
      difference: monthlyWage - jakartaWage,
    };

    return {
      selectedRegion: region,
      monthlyWage,
      dailyWage,
      hourlyWage,
      annualWage,
      costOfLivingAdjusted,
      comparisonWithJakarta,
    };
  };

  // Handle pre-selected region from map
  useEffect(() => {
    if (preSelectedRegion) {
      setSelectedRegion(preSelectedRegion);
      setSelectedProvince(preSelectedRegion.province.id);
      setCalculation(calculateWage(preSelectedRegion));
    }
  }, [preSelectedRegion]);

  const handleRegionChange = (regionId: string) => {
    const region = data.find((item) => item.id === regionId);
    if (region) {
      setSelectedRegion(region);
      setCalculation(calculateWage(region));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-ID").format(
      num,
    );
  };

  const getCostOfLivingColor = (level: string) => {
    const colors = {
      very_low: "bg-green-100 text-green-800 border-green-200",
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      medium_high: "bg-orange-100 text-orange-800 border-orange-200",
      high: "bg-red-100 text-red-800 border-red-200",
      very_high: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[level as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getCostOfLivingLabel = (level: string) => {
    const labels = {
      very_low: locale === "id" ? "Sangat Rendah" : "Very Low",
      low: locale === "id" ? "Rendah" : "Low",
      medium: locale === "id" ? "Sedang" : "Medium",
      medium_high: locale === "id" ? "Sedang-Tinggi" : "Medium-High",
      high: locale === "id" ? "Tinggi" : "High",
      very_high: locale === "id" ? "Sangat Tinggi" : "Very High",
    };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {locale === "id"
              ? "Kalkulator Upah Minimum Regional"
              : "Regional Minimum Wage Calculator"}
          </CardTitle>
          <CardDescription>
            {locale === "id"
              ? `Hitung dan bandingkan upah minimum di berbagai daerah Indonesia ${year}`
              : `Calculate and compare minimum wages across Indonesian regions ${year}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Region Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {locale === "id" ? "Pilih Provinsi" : "Select Province"}
              </label>
              <Select
                value={selectedProvince}
                onValueChange={(value) => {
                  setSelectedProvince(value);
                  setSelectedRegion(null);
                  setCalculation(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      locale === "id"
                        ? "Pilih provinsi..."
                        : "Select province..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {locale === "id"
                  ? "Pilih Kota/Kabupaten"
                  : "Select City/Regency"}
              </label>
              <Select
                value={selectedRegion?.id || ""}
                onValueChange={handleRegionChange}
                disabled={!selectedProvince}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      locale === "id"
                        ? "Pilih kota/kabupaten..."
                        : "Select city/regency..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.city.id}{" "}
                      {city.type === "provincial"
                        ? `(${locale === "id" ? "Provinsi" : "Province"})`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculation && (
        <>
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {selectedRegion?.city.id}, {selectedRegion?.province.id}
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge
                  className={getCostOfLivingColor(
                    selectedRegion?.costOfLiving || "medium",
                  )}
                >
                  {locale === "id" ? "Biaya Hidup: " : "Cost of Living: "}
                  {getCostOfLivingLabel(
                    selectedRegion?.costOfLiving || "medium",
                  )}
                </Badge>
                {selectedRegion?.increasePercent !== 0 &&
                  selectedRegion?.increasePercent !== undefined && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <TrendingUp className="w-3 h-3" />
                      {selectedRegion.increasePercent > 0 ? "+" : ""}
                      {selectedRegion.increasePercent.toFixed(2)}%
                    </Badge>
                  )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatNumber(selectedRegion?.population || 0)}{" "}
                  {locale === "id" ? "jiwa" : "people"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    {locale === "id" ? "UMR/Bulanan" : "Monthly Wage"}
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(calculation.monthlyWage)}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    {locale === "id" ? "Harian" : "Daily"}
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(calculation.dailyWage)}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    {locale === "id" ? "Per Jam" : "Hourly"}
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(calculation.hourlyWage)}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    {locale === "id" ? "Tahunan" : "Annual"}
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(calculation.annualWage)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "id"
                  ? "Analisis & Perbandingan"
                  : "Analysis & Comparison"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    {locale === "id"
                      ? "Daya Beli Disesuaikan"
                      : "Cost of Living Adjusted"}
                  </div>
                  <div className="text-xl font-bold">
                    {formatCurrency(calculation.costOfLivingAdjusted)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {locale === "id"
                      ? "Nilai ekuivalen berdasarkan biaya hidup"
                      : "Equivalent value based on cost of living"}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    {locale === "id"
                      ? "Perbandingan dengan Jakarta"
                      : "Comparison with Jakarta"}
                  </div>
                  <div className="text-xl font-bold">
                    {calculation.comparisonWithJakarta.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {calculation.comparisonWithJakarta.difference >= 0 ? (
                      <span className="text-green-600">
                        +
                        {formatCurrency(
                          calculation.comparisonWithJakarta.difference,
                        )}
                        {locale === "id" ? " lebih tinggi" : " higher"}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {formatCurrency(
                          calculation.comparisonWithJakarta.difference,
                        )}
                        {locale === "id" ? " lebih rendah" : " lower"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedRegion && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <div className="font-medium mb-1">
                    {locale === "id"
                      ? "Informasi Tambahan:"
                      : "Additional Information:"}
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      {locale === "id"
                        ? "Upah minimum berlaku sejak"
                        : "Minimum wage effective from"}{" "}
                      {new Date(
                        selectedRegion.effectiveDate,
                      ).toLocaleDateString(locale === "id" ? "id-ID" : "en-ID")}
                    </li>
                    <li>
                      {locale === "id"
                        ? "Kenaikan dari tahun sebelumnya:"
                        : "Increase from previous year:"}{" "}
                      {selectedRegion.increasePercent}% (
                      {formatCurrency(
                        selectedRegion.umr - selectedRegion.previousYear,
                      )}
                      )
                    </li>
                    <li>
                      {locale === "id"
                        ? "Populasi wilayah:"
                        : "Regional population:"}{" "}
                      {formatNumber(selectedRegion.population)}{" "}
                      {locale === "id" ? "jiwa" : "people"}
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
