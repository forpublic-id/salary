import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RegionalWagesView } from "@/components/salary/RegionalWagesView";
import { RegionalWageData } from "@/lib/types/salary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { TrendingUp, MapPin, Users, Calculator } from "lucide-react";

interface RegionalWagesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

async function getRegionalWageData(
  year: number,
): Promise<RegionalWageData | null> {
  try {
    // Use dynamic import for static file during build time (works in production)
    const data = await import(`@/public/data/salary/regional-wages/${year}.json`);
    return data.default || data;
  } catch (error) {
    console.error("Error loading regional wage data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: RegionalWagesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("regional-wages");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: [
      "UMR",
      "UMP",
      "upah minimum regional",
      "minimum wage Indonesia",
      "gaji minimum",
      "kalkulator upah",
      "regional wages",
      "salary calculator",
    ],
  };
}

export default async function RegionalWagesPage({
  params,
}: RegionalWagesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("regional-wages");

  const currentYear = new Date().getFullYear();
  const data = await getRegionalWageData(currentYear);

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {locale === "id" ? "Data tidak tersedia" : "Data not available"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "id"
              ? "Maaf, data upah minimum regional tidak dapat dimuat saat ini."
              : "Sorry, regional minimum wage data cannot be loaded at this time."}
          </p>
        </div>
      </div>
    );
  }

  const { regionalWages } = data;
  const highestWage = regionalWages.reduce((prev, current) =>
    prev.umr > current.umr ? prev : current,
  );
  const lowestWage = regionalWages.reduce((prev, current) =>
    prev.umr < current.umr ? prev : current,
  );
  const averageWage =
    regionalWages.reduce((sum, wage) => sum + wage.umr, 0) /
    regionalWages.length;
  const totalIncrease = regionalWages.filter(
    (w) => w.increasePercent > 0,
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const title = locale === "id" 
    ? "Upah Minimum Regional Indonesia" 
    : "Indonesia Regional Minimum Wages";
    
  const subtitle = locale === "id"
    ? `Kalkulator dan data lengkap upah minimum di seluruh Indonesia tahun ${currentYear}. Bandingkan UMR, UMP, dan daya beli di berbagai daerah.`
    : `Complete calculator and data for minimum wages across Indonesia ${currentYear}. Compare UMR, UMP, and purchasing power across regions.`;

  return (
    <PageLayout className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === "id" ? "Tertinggi" : "Highest"}
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(highestWage.umr)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {highestWage.city.id}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === "id" ? "Terendah" : "Lowest"}
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(lowestWage.umr)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lowestWage.city.id}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600 transform rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === "id" ? "Rata-rata" : "Average"}
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(averageWage)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {regionalWages.length}{" "}
                  {locale === "id" ? "daerah" : "regions"}
                </p>
              </div>
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === "id" ? "Naik" : "Increased"}
                </p>
                <p className="text-2xl font-bold">{totalIncrease}</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "id" ? "dari tahun lalu" : "from last year"}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculator & Map View */}
      <RegionalWagesView data={regionalWages} year={currentYear} />

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {locale === "id"
              ? "Informasi Upah Minimum"
              : "Minimum Wage Information"}
          </CardTitle>
          <CardDescription>
            {locale === "id"
              ? "Penjelasan singkat tentang sistem upah minimum di Indonesia"
              : "Brief explanation about minimum wage system in Indonesia"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">
                {locale === "id" ? "Apa itu UMR & UMP?" : "What are UMR & UMP?"}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <strong>UMP:</strong>{" "}
                  {locale === "id"
                    ? "Upah Minimum Provinsi - berlaku untuk seluruh provinsi"
                    : "Provincial Minimum Wage - applies to entire province"}
                </li>
                <li>
                  <strong>UMR:</strong>{" "}
                  {locale === "id"
                    ? "Upah Minimum Regional - berlaku untuk kota/kabupaten tertentu"
                    : "Regional Minimum Wage - applies to specific city/regency"}
                </li>
                <li>
                  {locale === "id"
                    ? "UMR umumnya lebih tinggi dari UMP karena menyesuaikan biaya hidup lokal"
                    : "UMR is usually higher than UMP as it adjusts to local cost of living"}
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">
                {locale === "id" ? "Faktor Penentu" : "Determining Factors"}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  •{" "}
                  {locale === "id"
                    ? "Kebutuhan Hidup Layak (KHL)"
                    : "Decent Living Needs (KHL)"}
                </li>
                <li>
                  •{" "}
                  {locale === "id"
                    ? "Inflasi dan pertumbuhan ekonomi"
                    : "Inflation and economic growth"}
                </li>
                <li>
                  •{" "}
                  {locale === "id"
                    ? "Produktivitas pekerja"
                    : "Worker productivity"}
                </li>
                <li>
                  •{" "}
                  {locale === "id"
                    ? "Kemampuan perusahaan"
                    : "Company capability"}
                </li>
                <li>
                  •{" "}
                  {locale === "id"
                    ? "Kondisi pasar tenaga kerja"
                    : "Labor market conditions"}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
