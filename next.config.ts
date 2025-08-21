import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Experimental features yang bisa menyebabkan masalah
  experimental: {
    // Matikan turbopack di config juga untuk memastikan
    turbo: undefined,
    // Optimasi memory
    optimizePackageImports: ["lucide-react"],
  },

  // Optimasi untuk development
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Webpack optimizations
  webpack: (config, { dev }) => {
    if (dev) {
      // Kurangi polling untuk file watching
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
