import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/_vercel/",
          "/admin/",
          "*.json$",
          "/temp/",
          "/tmp/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: ["https://salary.forpublic.id/sitemap.xml"],
    host: "https://salary.forpublic.id",
  };
}
