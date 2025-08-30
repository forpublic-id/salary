import type { MetadataRoute } from "next";

async function getTunjanganKinerjaPages() {
  try {
    // Fetch tunjangan kinerja data to generate ministry detail pages
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "https://salary.forpublic.id"}/data/salary/pns/tunjangan-kinerja.json`,
    );
    if (!response.ok) {
      console.warn("Failed to fetch tunjangan kinerja data for sitemap");
      return [];
    }

    const data = await response.json();
    const uniqueMinistries = Array.from(
      new Set(
        data.tunjanganKinerja.map((item: any) => ({
          slug: item.kode.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          kode: item.kode,
        })),
      ),
    ) as Array<{ slug: string; kode: string }>;

    return uniqueMinistries.map((ministry) => ({
      path: `/tunjangan-kinerja/${ministry.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }));
  } catch (error) {
    console.warn(
      "Error generating tunjangan kinerja pages for sitemap:",
      error,
    );
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://salary.forpublic.id";
  const locales = ["id", "en"];
  const currentDate = new Date();
  const weekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Core pages with SEO priorities
  const pages = [
    {
      path: "",
      priority: 1,
      changeFrequency: "daily" as const,
      lastModified: currentDate,
    },
    {
      path: "/calculator",
      priority: 0.9,
      changeFrequency: "weekly" as const,
      lastModified: currentDate,
    },
    {
      path: "/pns",
      priority: 0.9,
      changeFrequency: "monthly" as const,
      lastModified: currentDate,
    },
    {
      path: "/p3k",
      priority: 0.9,
      changeFrequency: "monthly" as const,
      lastModified: currentDate,
    },
    {
      path: "/regional-wages",
      priority: 0.9,
      changeFrequency: "monthly" as const,
      lastModified: currentDate,
    },
    {
      path: "/tunjangan-kinerja",
      priority: 0.9,
      changeFrequency: "weekly" as const,
      lastModified: currentDate,
    },
    {
      path: "/browse",
      priority: 0.8,
      changeFrequency: "daily" as const,
      lastModified: currentDate,
    },
    {
      path: "/analysis",
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: weekAgo,
    },
    {
      path: "/officials",
      priority: 0.8,
      changeFrequency: "monthly" as const,
      lastModified: weekAgo,
    },
    {
      path: "/aparatur-sipil-negara",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: weekAgo,
    },
    {
      path: "/about",
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: weekAgo,
    },
  ];

  // Get tunjangan kinerja ministry detail pages
  const tunjanganKinerjaPages = await getTunjanganKinerjaPages();

  const urls: MetadataRoute.Sitemap = [];

  // Add root redirect (highest priority)
  urls.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 1,
  });

  // Add all core page combinations for each locale
  locales.forEach((locale) => {
    pages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    });

    // Add tunjangan kinerja ministry detail pages for each locale
    tunjanganKinerjaPages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    });
  });

  return urls;
}
