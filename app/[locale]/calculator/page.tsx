import { getTranslations } from "next-intl/server";
import { SalaryCalculator } from "@/components/salary/SalaryCalculator";
import { PageWrapper } from "@/components/layout/PageLayout";
import {
  generateSEOMetadata,
  generatePageKeywords,
  generateCalculatorDescription,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculator" });

  const keywords = generatePageKeywords("calculator", locale);
  const description = generateCalculatorDescription(locale);

  return generateSEOMetadata({
    title: t("title"),
    description,
    keywords,
    locale,
  });
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("calculator");

  return (
    <PageWrapper
      title={t("title")}
      subtitle={t("subtitle")}
      maxWidth="4xl"
    >
      <SalaryCalculator locale={locale} />
    </PageWrapper>
  );
}
