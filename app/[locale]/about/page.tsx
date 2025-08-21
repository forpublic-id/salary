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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about");

  return (
    <PageWrapper
      title={t("title")}
      subtitle={t("subtitle")}
      maxWidth="4xl"
    >
      <div className="space-y-8">
        {/* Mission */}
        <Card>
          <CardHeader>
            <CardTitle>{t("mission.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("mission.content1")}</p>
            <p>{t("mission.content2")}</p>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dataSources.title")}</CardTitle>
            <CardDescription>{t("dataSources.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">
                  {t("dataSources.civilService")}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <Badge variant="outline">PP No. 15/2024</Badge> - Base
                    salary structure
                  </li>
                  <li>
                    • <Badge variant="outline">Ministry Regulations</Badge> -
                    Performance allowances
                  </li>
                  <li>
                    • <Badge variant="outline">Government Circulars</Badge> -
                    Additional benefits
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">
                  {t("dataSources.publicOfficials")}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <Badge variant="outline">UU No. 7/2017</Badge> - State
                    officials compensation
                  </li>
                  <li>
                    • <Badge variant="outline">Regional Regulations</Badge> -
                    Local officials salary
                  </li>
                  <li>
                    • <Badge variant="outline">Official Announcements</Badge> -
                    Current rates
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">{t("dataSources.quality")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="font-bold text-2xl text-primary">100%</div>
                  <div className="text-sm">
                    {t("dataSources.officialSources")}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="font-bold text-2xl text-primary">Monthly</div>
                  <div className="text-sm">{t("dataSources.dataUpdates")}</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="font-bold text-2xl text-primary">
                    Cross-checked
                  </div>
                  <div className="text-sm">{t("dataSources.verification")}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>{t("features.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {t("features.salaryCalculator.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.salaryCalculator.desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {t("features.advancedSearch.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.advancedSearch.desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {t("features.dataVisualization.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.dataVisualization.desc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">👨‍💼</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {t("features.officialsDirectory.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.officialsDirectory.desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {t("features.bilingualSupport.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.bilingualSupport.desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">🔗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {t("features.openApi.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("features.openApi.desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>{t("legal.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("legal.content")}</p>
            <ul className="space-y-2 text-sm">
              <li>• {t("legal.law1")}</li>
              <li>• {t("legal.law2")}</li>
              <li>• {t("legal.law3")}</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              {t("legal.disclaimer")}
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>{t("contact.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{t("contact.content")}</p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline">GitHub: forpublic-id/salary</Badge>
              <Badge variant="outline">Email: contact@forpublic.id</Badge>
              <Badge variant="outline">Web: forpublic.id</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
