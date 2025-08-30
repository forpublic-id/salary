import { getTranslations } from "next-intl/server";
import { PageWrapper } from "@/components/layout/PageLayout";
import { P3KClient } from "./P3KClient";
import { generateSEOMetadata, generatePageKeywords } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "p3k" });

  const keywords = generatePageKeywords("p3k", locale);
  const description =
    locale === "id"
      ? "Daftar lengkap gaji pokok Pegawai Pemerintah dengan Perjanjian Kerja (P3K) berdasarkan golongan dan kualifikasi pendidikan."
      : "Complete list of Government Employees with Work Contracts (P3K) basic salary by grade and educational qualification.";

  return generateSEOMetadata({
    title: t("title"),
    description,
    keywords,
    locale,
  });
}

export default async function P3KPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("p3k");

  return (
    <PageWrapper title={t("title")} subtitle={t("subtitle")} maxWidth="6xl">
      <P3KClient locale={locale} />
    </PageWrapper>
  );
}