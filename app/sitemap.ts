import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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
      path: "/regional-wages",
      priority: 0.9,
      changeFrequency: "monthly" as const,
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
      path: "/about",
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: weekAgo,
    },
  ];

  const urls: MetadataRoute.Sitemap = [];

  // Add root redirect (highest priority)
  urls.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 1,
  });

  // Add all page combinations for each locale
  locales.forEach((locale) => {
    pages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    });
  });

  return urls;
}
