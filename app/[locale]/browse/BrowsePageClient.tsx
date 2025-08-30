"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { PageWrapper } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  MapPin,
  Calculator,
  FileText,
  Clock,
  Target,
  Lightbulb,
  Search,
  ExternalLink,
} from "lucide-react";

interface PlatformStats {
  totalGrades: number;
  totalMinistries: number;
  totalOfficials: number;
  totalProvinces: number;
  highestSalary: number;
  averageSalary: number;
  lastUpdated: string;
}

interface BrowsePageClientProps {
  locale: string;
}

export default function BrowsePageClient({ locale }: BrowsePageClientProps) {
  const t = useTranslations("browse");

  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data to generate platform stats
        const [golonganRes, tunjanganRes, officialsRes, regionalRes] = await Promise.all([
          fetch("/data/salary/pns/golongan.json"),
          fetch("/data/salary/pns/tunjangan-kinerja.json"),
          fetch("/data/salary/officials/nasional.json"),
          fetch("/data/salary/regional-wages/2025.json"),
        ]);

        const golonganData = await golonganRes.json();
        const tunjanganData = await tunjanganRes.json();
        const officialsData = await officialsRes.json();
        const regionalData = await regionalRes.json();

        // Calculate platform statistics
        const totalGrades = golonganData.golongan?.length || 0;
        const totalMinistries = new Set(
          tunjanganData.tunjanganKinerja?.map((item: any) => item.kementerian.id) || []
        ).size;
        const totalOfficials = officialsData.officials?.length || 0;
        const totalProvinces = regionalData.provinces?.length || 34;

        // Calculate salary statistics
        const allSalaries = [
          ...(golonganData.golongan?.map((g: any) => g.gajiPokok) || []),
          ...(tunjanganData.tunjanganKinerja?.map((t: any) => t.nominal) || []),
        ];
        
        const highestSalary = Math.max(...allSalaries);
        const averageSalary = allSalaries.reduce((a, b) => a + b, 0) / allSalaries.length;

        setPlatformStats({
          totalGrades,
          totalMinistries,
          totalOfficials,
          totalProvinces,
          highestSalary,
          averageSalary,
          lastUpdated: new Date().toLocaleDateString(locale === "id" ? "id-ID" : "en-US"),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const quickAccessItems = [
    {
      title: locale === "id" ? "Pegawai Negeri Sipil" : "Civil Servants",
      description: locale === "id" ? "Gaji pokok PNS" : "PNS basic salary",
      href: "/pns",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: locale === "id" ? "Pegawai Pemerintah dengan Perjanjian Kerja" : "Government Employees with Work Contracts",
      description: locale === "id" ? "Gaji pokok P3K" : "P3K basic salary",
      href: "/p3k",
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: locale === "id" ? "Tunjangan Kinerja" : "Performance Allowance",
      description: locale === "id" ? "Tunjangan per kementerian" : "Allowances by ministry",
      href: "/tunjangan-kinerja",
      icon: Building2,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: locale === "id" ? "Pejabat Publik" : "Public Officials",
      description: locale === "id" ? "Kompensasi pejabat" : "Officials compensation",
      href: "/officials",
      icon: Target,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: locale === "id" ? "Upah Regional" : "Regional Wages",
      description: locale === "id" ? "UMP & UMR daerah" : "Regional minimum wages",
      href: "/regional-wages",
      icon: MapPin,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: locale === "id" ? "Kalkulator Gaji" : "Salary Calculator",
      description: locale === "id" ? "Hitung estimasi gaji" : "Calculate salary estimates",
      href: "/calculator",
      icon: Calculator,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  const trendingSearches = [
    locale === "id" ? "Golongan III/a" : "Grade III/a",
    locale === "id" ? "Tunjangan kinerja guru" : "Teacher performance allowance",
    locale === "id" ? "Gaji gubernur" : "Governor salary",
    locale === "id" ? "UMP Jakarta" : "Jakarta minimum wage",
    locale === "id" ? "Eselon IV" : "Echelon IV",
  ];

  const recentUpdates = [
    {
      date: "2025-01-15",
      title: locale === "id" ? "Update data gaji PNS 2025" : "2025 PNS salary data update",
      type: "data",
    },
    {
      date: "2025-01-10",
      title: locale === "id" ? "Penambahan fitur export CSV" : "Added CSV export feature",
      type: "feature",
    },
    {
      date: "2025-01-05",
      title: locale === "id" ? "Data tunjangan kinerja terbaru" : "Latest performance allowance data",
      type: "data",
    },
  ];

  if (loading) {
    return (
      <PageWrapper title={t("title")} subtitle={t("subtitle")}>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={t("title")} subtitle={t("subtitle")}>
      <div className="space-y-8">
        {/* Platform Overview Dashboard */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{t("dashboard.title")}</h2>
          </div>
          
          {platformStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {platformStats.totalGrades}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("stats.totalGrades")}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {platformStats.totalMinistries}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("stats.totalMinistries")}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {platformStats.totalOfficials}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("stats.totalOfficials")}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {platformStats.totalProvinces}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("stats.totalProvinces")}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-indigo-600">
                    {formatCurrency(platformStats.highestSalary)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("stats.highestSalary")}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(platformStats.averageSalary)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("stats.averageSalary")}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Did You Know? Facts */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{t("insights.title")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {t("facts.fact1")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {t("facts.fact2")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      {t("facts.fact3")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-900">
                      {t("facts.fact4")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>



        {/* Data Quality Metrics */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{t("dataQuality.title")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {locale === "id" ? "Sumber Data" : "Data Sources"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">PP No. 5/2024</span>
                    <Badge variant="outline" className="text-xs">
                      {locale === "id" ? "Resmi" : "Official"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Perpres No. 98/2020</span>
                    <Badge variant="outline" className="text-xs">
                      {locale === "id" ? "Resmi" : "Official"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Perda UMP</span>
                    <Badge variant="outline" className="text-xs">
                      {locale === "id" ? "Regional" : "Regional"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {locale === "id" ? "Akurasi Data" : "Data Accuracy"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {locale === "id" ? "Verifikasi" : "Verification"}
                    </span>
                    <Badge className="bg-green-100 text-green-800">99%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {locale === "id" ? "Kelengkapan" : "Completeness"}
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">95%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {locale === "id" ? "Update Rutin" : "Regular Updates"}
                    </span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {locale === "id" ? "Bulanan" : "Monthly"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {locale === "id" ? "Cakupan Data" : "Data Coverage"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">
                      {platformStats?.totalGrades || 0}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {locale === "id" ? "golongan gaji" : "salary grades"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      {platformStats?.totalMinistries || 0}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {locale === "id" ? "kementerian" : "ministries"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">34</span>
                    <span className="text-muted-foreground ml-1">
                      {locale === "id" ? "provinsi" : "provinces"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{t("quickAccess.title")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={`/${locale}${item.href}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                          <div className="mt-3 flex items-center text-xs text-primary">
                            <span>
                              {locale === "id" ? "Jelajahi" : "Explore"}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trending Searches */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{t("trending.title")}</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((search, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    <Search className="h-3 w-3 mr-2" />
                    {search}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Updates Feed */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{t("recentUpdates.title")}</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={update.type === "data" ? "default" : "secondary"}
                        className="min-w-fit"
                      >
                        {update.type === "data" ? 
                          (locale === "id" ? "Data" : "Data") : 
                          (locale === "id" ? "Fitur" : "Feature")
                        }
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{update.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(update.date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageWrapper>
  );
}