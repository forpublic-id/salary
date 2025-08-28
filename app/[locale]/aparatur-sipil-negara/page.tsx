import { getTranslations } from "next-intl/server";
import { PageWrapper } from "@/components/layout/PageLayout";
import { AparaturSipilNegaraClient } from "./AparaturSipilNegaraClient";
import {
  generateSEOMetadata,
  generatePageKeywords,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aparatur" });

  const keywords = generatePageKeywords("aparatur", locale);
  const description = locale === "id" 
    ? "Daftar lengkap gaji pokok Aparatur Sipil Negara (ASN) dan Pegawai Pemerintah dengan Perjanjian Kerja (P3K) berdasarkan golongan dan pangkat."
    : "Complete list of Civil State Apparatus (ASN) and Government Employees with Work Contracts (P3K) basic salary by grade and rank.";

  return generateSEOMetadata({
    title: t("title"),
    description,
    keywords,
    locale,
  });
}

export default async function AparaturSipilNegaraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("aparatur");

  return (
    <PageWrapper title={t("title")} subtitle={t("subtitle")} maxWidth="6xl">
      <AparaturSipilNegaraClient locale={locale} />
    </PageWrapper>
  );
}