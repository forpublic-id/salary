import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageWrapper } from "@/components/layout/PageLayout";
import { formatCurrency } from "@/lib/utils";
import {
  generateSEOMetadata,
  generatePageKeywords,
  generateOfficialsDescription,
} from "@/lib/seo";
import type { OfficialSalary } from "@/lib/types/salary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "officials" });

  const keywords = generatePageKeywords("officials", locale);
  const description = generateOfficialsDescription(50, locale); // Estimate 50+ officials

  return generateSEOMetadata({
    title: t("title"),
    description,
    keywords,
    locale,
  });
}

async function getOfficialSalaryData(): Promise<{
  officials: OfficialSalary[];
}> {
  try {
    // Use dynamic import for static file during build time
    const data = await import("@/public/data/salary/officials/nasional.json");
    return { officials: (data.officials || []) as OfficialSalary[] };
  } catch (error) {
    console.error("Error loading officials data:", error);
    return { officials: [] };
  }
}

export default async function OfficialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("officials");
  const tCommon = await getTranslations("common");

  const { officials } = await getOfficialSalaryData();

  return (
    <PageWrapper
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officials.map((official) => (
            <Card
              key={official.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  {official.position[locale as "id" | "en"]}
                </CardTitle>
                <CardDescription>
                  {tCommon("total")}:{" "}
                  {formatCurrency(official.totalKompensasi, locale)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Base Salary */}
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{t("baseSalary")}</span>
                  <Badge variant="secondary">
                    {formatCurrency(official.gajiPokok, locale)}
                  </Badge>
                </div>

                {/* Allowances */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t("allowances")}:</h4>
                  {official.tunjangan.map((tunjangan, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {tunjangan.name[locale as "id" | "en"]}
                      </span>
                      <span className="font-mono">
                        {formatCurrency(tunjangan.nominal, locale)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{t("totalMonthly")}:</span>
                    <Badge className="font-mono">
                      {formatCurrency(official.totalKompensasi, locale)}
                    </Badge>
                  </div>
                </div>

                {/* Source */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  {t("source")}: {official.source}
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {officials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noData")}</p>
        </div>
      )}
    </PageWrapper>
  );
}
