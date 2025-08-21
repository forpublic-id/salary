import type { Metadata } from "next";

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// Base keywords for each language
export const baseKeywords = {
  id: [
    "gaji PNS",
    "tunjangan kinerja",
    "transparansi pemerintah",
    "pegawai negeri sipil",
    "gaji pejabat publik",
    "kompensasi PNS",
    "golongan PNS",
    "eselon",
    "kalkulator gaji",
    "data gaji pemerintah",
    "forpublic.id",
  ],
  en: [
    "Indonesian civil service salary",
    "PNS salary",
    "government transparency",
    "public officials salary",
    "civil servant compensation",
    "performance allowance",
    "salary calculator",
    "government accountability",
    "Indonesian government salary",
  ],
};

// Generate page-specific keywords
export function generatePageKeywords(
  page: string,
  locale: string,
  additionalKeywords: string[] = [],
): string[] {
  const base =
    baseKeywords[locale as keyof typeof baseKeywords] || baseKeywords.id;

  const pageSpecific = getPageSpecificKeywords(page, locale);

  return [...base, ...pageSpecific, ...additionalKeywords];
}

// Get page-specific keywords
function getPageSpecificKeywords(page: string, locale: string): string[] {
  if (locale === "id") {
    switch (page) {
      case "calculator":
        return [
          "kalkulator gaji PNS",
          "hitung gaji pegawai negeri sipil",
          "estimasi gaji PNS",
          "simulator gaji",
        ];
      case "browse":
        return [
          "data gaji PNS",
          "database gaji pemerintah",
          "perbandingan gaji PNS",
          "struktur gaji kementerian",
        ];
      case "analysis":
        return [
          "analisis gaji PNS",
          "statistik gaji pemerintah",
          "tren gaji PNS",
          "visualisasi data gaji",
        ];
      case "officials":
        return [
          "gaji pejabat negara",
          "gaji presiden",
          "gaji menteri",
          "gaji gubernur",
          "gaji DPR",
        ];
      default:
        return [];
    }
  } else {
    switch (page) {
      case "calculator":
        return [
          "civil service salary calculator",
          "PNS salary estimator",
          "government salary calculator",
        ];
      case "browse":
        return [
          "civil service salary data",
          "government salary database",
          "ministry salary comparison",
        ];
      case "analysis":
        return [
          "salary analysis",
          "government salary statistics",
          "compensation trends",
        ];
      case "officials":
        return [
          "government officials salary",
          "president salary",
          "minister compensation",
        ];
      default:
        return [];
    }
  }
}

// Generate SEO-optimized metadata
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  ogImage = "/favicon.svg",
  locale = "id",
}: {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  locale?: string;
}): Metadata {
  const baseUrl = "https://salary.forpublic.id";
  const fullTitle = `${title} | Salary ForPublic.id`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: "ForPublic.id Team" }],
    creator: "ForPublic.id",
    publisher: "ForPublic.id",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
      languages: {
        "id-ID": "/id",
        "en-US": "/en",
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: baseUrl,
      siteName: "ForPublic.id",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? "en_US" : "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@forpublic_id",
      site: "@forpublic_id",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/favicon.svg" }],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    category: "Government",
  };
}

// Generate rich descriptions based on data
export function generateCalculatorDescription(locale: string): string {
  if (locale === "id") {
    return "Kalkulator gaji PNS Indonesia lengkap dengan estimasi tunjangan kinerja berdasarkan golongan, jabatan, dan masa kerja. Hitung gaji pegawai negeri sipil dari golongan I/a hingga IV/e secara akurat dengan data resmi pemerintah.";
  } else {
    return "Complete Indonesian civil service salary calculator with performance allowance estimation based on grade, position, and years of service. Calculate PNS salary from grade I/a to IV/e accurately with official government data.";
  }
}

export function generateBrowseDescription(
  dataCount: number,
  locale: string,
): string {
  if (locale === "id") {
    return `Database lengkap ${dataCount}+ data gaji PNS dan tunjangan kinerja dari berbagai kementerian. Jelajahi, bandingkan, dan analisis struktur gaji pegawai negeri sipil Indonesia dengan fitur pencarian dan filter canggih.`;
  } else {
    return `Comprehensive database of ${dataCount}+ Indonesian civil service salary data and performance allowances from various ministries. Explore, compare, and analyze PNS salary structures with advanced search and filtering features.`;
  }
}

export function generateAnalysisDescription(locale: string): string {
  if (locale === "id") {
    return "Analisis mendalam data gaji PNS Indonesia dengan visualisasi interaktif. Lihat distribusi gaji, perbandingan antar kementerian, tren kompensasi, dan statistik lengkap untuk transparansi pemerintahan.";
  } else {
    return "In-depth analysis of Indonesian civil service salary data with interactive visualizations. View salary distribution, ministry comparisons, compensation trends, and comprehensive statistics for government transparency.";
  }
}

export function generateOfficialsDescription(
  officialsCount: number,
  locale: string,
): string {
  if (locale === "id") {
    return `Database transparan gaji ${officialsCount}+ pejabat publik Indonesia termasuk presiden, menteri, gubernur, walikota, dan anggota legislatif. Informasi kompensasi lengkap dengan sumber resmi untuk akuntabilitas pemerintahan.`;
  } else {
    return `Transparent database of ${officialsCount}+ Indonesian public officials' salaries including president, ministers, governors, mayors, and legislative members. Complete compensation information with official sources for government accountability.`;
  }
}

// Structured Data Helpers
export function generateStructuredData(
  type: "website" | "organization" | "dataset" | "government",
  data: any,
) {
  const baseStructuredData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "website":
      return {
        ...baseStructuredData,
        "@type": "WebSite",
        name: "Salary ForPublic.id",
        url: "https://salary.forpublic.id",
        description: "Transparansi gaji PNS dan pejabat publik Indonesia",
        inLanguage: ["id", "en"],
        isPartOf: {
          "@type": "Organization",
          name: "ForPublic.id",
          url: "https://forpublic.id",
        },
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://salary.forpublic.id/id/browse?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };

    case "organization":
      return {
        ...baseStructuredData,
        "@type": "Organization",
        name: "ForPublic.id",
        url: "https://forpublic.id",
        logo: "https://salary.forpublic.id/logo.png",
        sameAs: [
          "https://github.com/forpublic-id",
          "https://twitter.com/forpublic_id",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "contact@forpublic.id",
        },
      };

    case "dataset":
      return {
        ...baseStructuredData,
        "@type": "Dataset",
        name: data.name,
        description: data.description,
        url: data.url,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: {
          "@type": "Organization",
          name: "ForPublic.id",
        },
        publisher: {
          "@type": "Organization",
          name: "Government of Indonesia",
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        keywords: data.keywords,
        inLanguage: ["id", "en"],
      };

    case "government":
      return {
        ...baseStructuredData,
        "@type": "GovernmentService",
        name: "Indonesian Civil Service Salary Information",
        description:
          "Official salary information for Indonesian civil servants and public officials",
        provider: {
          "@type": "GovernmentOrganization",
          name: "Government of Indonesia",
        },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: "https://salary.forpublic.id",
          serviceType: "Online Information Service",
        },
      };

    default:
      return baseStructuredData;
  }
}

// SEO Keywords by page
export const seoKeywords = {
  home: {
    id: "gaji PNS, tunjangan kinerja, gaji pejabat publik, transparansi pemerintah, ForPublic.id, gaji pegawai negeri sipil, kompensasi PNS, golongan PNS, eselon, tunjangan jabatan",
    en: "Indonesian civil service salary, PNS salary, public officials salary, government transparency, civil servant compensation, performance allowance, salary calculator, government accountability",
  },
  calculator: {
    id: "kalkulator gaji PNS, hitung gaji pegawai negeri sipil, estimasi gaji PNS, golongan PNS, tunjangan kinerja, gaji pokok PNS, masa kerja PNS",
    en: "PNS salary calculator, civil service salary calculator, Indonesian government salary, salary estimation, grade calculation, performance allowance calculator",
  },
  browse: {
    id: "data gaji PNS, database gaji pegawai negeri sipil, perbandingan gaji PNS, gaji kementerian, tunjangan jabatan, struktur gaji pemerintah",
    en: "civil service salary data, government salary database, PNS salary comparison, ministry salaries, position allowances, government pay structure",
  },
  analysis: {
    id: "analisis gaji PNS, statistik gaji pegawai negeri sipil, tren gaji pemerintah, perbandingan gaji kementerian, visualisasi data gaji",
    en: "civil service salary analysis, government salary statistics, salary trends, ministry comparison, salary data visualization, compensation analysis",
  },
  officials: {
    id: "gaji pejabat negara, gaji presiden, gaji menteri, gaji gubernur, gaji walikota, gaji bupati, gaji DPR, kompensasi pejabat publik",
    en: "government officials salary, president salary, minister salary, governor salary, mayor salary, legislative salary, public officials compensation",
  },
};
