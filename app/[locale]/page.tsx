import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  Calculator,
  Search,
  BarChart3,
  Users,
  TrendingUp,
  Code,
  MapPin,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("hero");

  const features = [
    {
      icon: Calculator,
      titleKey: "calculator",
      title: t("features.calculator.title"),
      description: t("features.calculator.desc"),
      href: "/calculator",
      color: "text-blue-500",
    },
    {
      icon: Users,
      titleKey: "pns",
      title: t("features.pns.title"),
      description: t("features.pns.desc"),
      href: "/pns",
      color: "text-green-500",
    },
    {
      icon: FileText,
      titleKey: "p3k",
      title: t("features.p3k.title"),
      description: t("features.p3k.desc"),
      href: "/p3k",
      color: "text-orange-500",
    },
    {
      icon: Building2,
      titleKey: "tunjanganKinerja",
      title: t("features.tunjanganKinerja.title"),
      description: t("features.tunjanganKinerja.desc"),
      href: "/tunjangan-kinerja",
      color: "text-indigo-500",
    },
    {
      icon: Search,
      titleKey: "browse",
      title: t("features.browse.title"),
      description: t("features.browse.desc"),
      href: "/browse",
      color: "text-purple-500",
    },
    {
      icon: BarChart3,
      titleKey: "analysis",
      title: t("features.analysis.title"),
      description: t("features.analysis.desc"),
      href: "/analysis",
      color: "text-red-500",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="mx-auto">
                {locale === "id"
                  ? "Transparansi Publik"
                  : "Public Transparency"}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                {t("title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/browse`}>
                <Button size="lg" className="px-8">
                  {t("cta")}
                </Button>
              </Link>
              <Link href={`/${locale}/calculator`}>
                <Button variant="outline" size="lg" className="px-8">
                  {t("calculateSalary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {locale === "id" ? "Fitur Platform" : "Platform Features"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {locale === "id"
                ? "Akses komprehensif ke data gaji dan transparansi kompensasi Indonesia"
                : "Comprehensive access to Indonesian salary data and compensation transparency"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.titleKey} href={`/${locale}${feature.href}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg bg-muted ${feature.color}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">17</div>
              <div className="text-muted-foreground">
                {locale === "id" ? "Golongan Gaji" : "Salary Grades"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">
                {locale === "id" ? "Posisi Jabatan" : "Position Types"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">
                {locale === "id"
                  ? "Kementerian & Lembaga"
                  : "Ministries & Agencies"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              {locale === "id"
                ? "Mulai Jelajahi Data Transparansi"
                : "Start Exploring Transparency Data"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === "id"
                ? "Dapatkan akses lengkap ke informasi gaji dan upah Indonesia untuk mendukung akuntabilitas pemerintahan"
                : "Get complete access to Indonesian salary and wage information to support government accountability"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/calculator`}>
                <Button size="lg" className="px-8">
                  {locale === "id"
                    ? "Hitung Gaji Sekarang"
                    : "Calculate Salary Now"}
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <Button variant="outline" size="lg" className="px-8">
                  {locale === "id" ? "Pelajari Lebih Lanjut" : "Learn More"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
