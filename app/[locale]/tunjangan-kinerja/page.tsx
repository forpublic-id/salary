import { getTranslations } from "next-intl/server";
import { generateSEOMetadata, generatePageKeywords } from "@/lib/seo";
import TunjanganKinerjaPageClient from "./TunjanganKinerjaPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tunjanganKinerja" });

  const keywords = generatePageKeywords("tunjangan-kinerja", locale);
  const description =
    locale === "id"
      ? "Jelajahi data tunjangan kinerja PNS Indonesia terlengkap. Bandingkan gaji dan tunjangan antar kementerian dengan statistik detail dan visualisasi interaktif."
      : "Explore comprehensive Indonesian civil servant performance allowance data. Compare salaries and allowances across ministries with detailed statistics and interactive visualizations.";

  return generateSEOMetadata({
    title: t("title"),
    description,
    keywords,
    locale,
  });
}

export default async function TunjanganKinerjaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <TunjanganKinerjaPageClient locale={locale} />;
}
