import { getTranslations } from "next-intl/server";
import { PageWrapper } from "@/components/layout/PageLayout";
import { PNSClient } from "./PNSClient";
import { generateSEOMetadata, generatePageKeywords } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pns" });

  const keywords = generatePageKeywords("pns", locale);
  const description =
    locale === "id"
      ? "Daftar lengkap gaji pokok Pegawai Negeri Sipil (PNS) berdasarkan golongan dan pangkat dengan masa kerja yang berbeda."
      : "Complete list of Civil Servants (PNS) basic salary by grade and rank with different years of service.";

  return generateSEOMetadata({
    title: t("title"),
    description,
    keywords,
    locale,
  });
}

export default async function PNSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("pns");

  return (
    <PageWrapper title={t("title")} subtitle={t("subtitle")} maxWidth="6xl">
      <PNSClient locale={locale} />
    </PageWrapper>
  );
}