import { getTranslations } from "next-intl/server";
import {
  generateSEOMetadata,
  generatePageKeywords,
  generateAnalysisDescription,
} from "@/lib/seo";
import AnalysisPageClient from "./AnalysisPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "analysis" });

  const keywords = generatePageKeywords("analysis", locale);
  const description = generateAnalysisDescription(locale);

  return generateSEOMetadata({
    title: t("title"),
    description,
    keywords,
    locale,
  });
}

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <AnalysisPageClient locale={locale} />;
}
