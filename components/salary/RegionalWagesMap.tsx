"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { RegionalWage } from "@/lib/types/salary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, TrendingUp } from "lucide-react";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface RegionalWagesMapProps {
  data: RegionalWage[];
  year: number;
  onRegionSelect?: (region: RegionalWage) => void;
}

interface MapFeature {
  type: string;
  properties: {
    id: string;
    name: string;
    province: string;
  };
  geometry: any;
}

export function RegionalWagesMap({
  data,
  year,
  onRegionSelect,
}: RegionalWagesMapProps) {
  const locale = useLocale();
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionalWage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load GeoJSON data
    const loadGeoData = async () => {
      try {
        const response = await fetch("/data/geo/indonesia-provinces.geojson");
        const data = await response.json();
        setGeoData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        setIsLoading(false);
      }
    };

    loadGeoData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWageColor = (umr: number) => {
    // Color scale based on UMR values
    if (umr >= 5000000) return "#dc2626"; // Red - Very High
    if (umr >= 4000000) return "#ea580c"; // Orange-Red - High
    if (umr >= 3000000) return "#f59e0b"; // Orange - Medium-High
    if (umr >= 2500000) return "#eab308"; // Yellow - Medium
    if (umr >= 2000000) return "#84cc16"; // Light Green - Low
    return "#22c55e"; // Green - Very Low
  };

  const getFeatureStyle = (feature: any) => {
    if (!feature || !feature.properties) {
      return {
        fillColor: "#22c55e",
        weight: 2,
        opacity: 1,
        color: "#ffffff",
        dashArray: "",
        fillOpacity: 0.7,
      };
    }

    const regionData = data.find(
      (d) =>
        d.province.id.toLowerCase().replace(/\s+/g, "-") ===
        feature.properties.id,
    );

    const umr = regionData?.umr || 0;

    return {
      fillColor: getFeatureColor(umr),
      weight: 2,
      opacity: 1,
      color: "#ffffff",
      dashArray: "",
      fillOpacity: 0.7,
    };
  };

  const getFeatureColor = (umr: number) => {
    if (umr >= 5000000) return "#dc2626";
    if (umr >= 4000000) return "#ea580c";
    if (umr >= 3000000) return "#f59e0b";
    if (umr >= 2500000) return "#eab308";
    if (umr >= 2000000) return "#84cc16";
    return "#22c55e";
  };

  const onEachFeature = (feature: any, layer: any) => {
    if (!feature || !feature.properties) return;

    const regionData = data.find(
      (d) =>
        d.province.id.toLowerCase().replace(/\s+/g, "-") ===
        feature.properties.id,
    );

    if (regionData) {
      layer.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-1">${feature.properties.name}</h3>
          <div class="text-xs space-y-1">
            <div><strong>UMR:</strong> ${formatCurrency(regionData.umr)}</div>
            <div><strong>${locale === "id" ? "Kenaikan" : "Increase"}:</strong> ${regionData.increasePercent}%</div>
            <div><strong>${locale === "id" ? "Populasi" : "Population"}:</strong> ${regionData.population.toLocaleString()}</div>
          </div>
        </div>
      `);

      layer.on({
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9,
          });
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle(getFeatureStyle(feature));
        },
        click: (e: any) => {
          setSelectedRegion(regionData);
          if (onRegionSelect) {
            onRegionSelect(regionData);
          }
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {locale === "id" ? "Memuat peta..." : "Loading map..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {locale === "id"
              ? "Peta Sebaran Upah Minimum Regional"
              : "Regional Minimum Wage Distribution Map"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full rounded-lg overflow-hidden border">
            {typeof window !== "undefined" && geoData && (
              <MapContainer
                center={[-2.5, 118]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON
                  data={geoData}
                  style={getFeatureStyle}
                  onEachFeature={onEachFeature}
                />
              </MapContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === "id" ? "Legenda" : "Legend"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#22c55e" }}
              ></div>
              <span className="text-xs">
                {"< "}
                {formatCurrency(2000000)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#84cc16" }}
              ></div>
              <span className="text-xs">
                {formatCurrency(2000000)} - {formatCurrency(2500000)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#eab308" }}
              ></div>
              <span className="text-xs">
                {formatCurrency(2500000)} - {formatCurrency(3000000)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#f59e0b" }}
              ></div>
              <span className="text-xs">
                {formatCurrency(3000000)} - {formatCurrency(4000000)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#ea580c" }}
              ></div>
              <span className="text-xs">
                {formatCurrency(4000000)} - {formatCurrency(5000000)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#dc2626" }}
              ></div>
              <span className="text-xs">
                {"> "}
                {formatCurrency(5000000)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Region Info */}
      {selectedRegion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {selectedRegion.city.id}, {selectedRegion.province.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {locale === "id" ? "UMR" : "Minimum Wage"}
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(selectedRegion.umr)}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {locale === "id" ? "Kenaikan" : "Increase"}
                </div>
                <div className="text-lg font-semibold flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  {selectedRegion.increasePercent}%
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {locale === "id" ? "Populasi" : "Population"}
                </div>
                <div className="text-lg font-semibold">
                  {selectedRegion.population.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {locale === "id" ? "Biaya Hidup" : "Cost of Living"}
                </div>
                <Badge className="text-xs">
                  {selectedRegion.costOfLiving.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
