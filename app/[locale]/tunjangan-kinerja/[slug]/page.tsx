import { getTranslations } from "next-intl/server";
import { generateSEOMetadata, generatePageKeywords } from "@/lib/seo";
import { notFound } from "next/navigation";
import MinistryDetailPageClient from "./MinistryDetailPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "tunjanganKinerja" });

  // Convert slug back to ministry name for title
  const ministryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const keywords = generatePageKeywords("tunjangan-kinerja", locale);
  const description =
    locale === "id"
      ? `Detail tunjangan kinerja ${ministryName} - breakdown jabatan, nominal tunjangan, dan regulasi terkait. Data lengkap dan akurat untuk transparansi gaji PNS.`
      : `${ministryName} performance allowance details - position breakdown, allowance amounts, and related regulations. Complete and accurate data for civil servant salary transparency.`;

  return generateSEOMetadata({
    title: `${ministryName} - ${t("title")}`,
    description,
    keywords,
    locale,
  });
}

export async function generateStaticParams() {
  // Get all ministry slugs from the data
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/data/salary/pns/tunjangan-kinerja.json`,
    );
    const data = await response.json();

    const ministries = Array.from(
      new Set(
        data.tunjanganKinerja.map((item: any) => ({
          slug: item.kode.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          kode: item.kode,
        })),
      ),
    ) as Array<{ slug: string; kode: string }>;

    // Generate params for both locales
    const params = [];
    for (const ministry of ministries) {
      params.push({ locale: "id", slug: ministry.slug });
      params.push({ locale: "en", slug: ministry.slug });
    }

    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function MinistryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Validate that this is a valid ministry slug
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/data/salary/pns/tunjangan-kinerja.json`,
    );
    const data = await response.json();

    const validSlugs = Array.from(
      new Set(
        data.tunjanganKinerja.map((item: any) =>
          item.kode.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        ),
      ),
    );

    if (!validSlugs.includes(slug)) {
      notFound();
    }
  } catch (error) {
    console.error("Error validating ministry slug:", error);
    notFound();
  }

  return <MinistryDetailPageClient locale={locale} slug={slug} />;
}
