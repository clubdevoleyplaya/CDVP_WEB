import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

import { securityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  // Las imágenes optimizadas se guardan 31 días y solo en WebP (AVIF gasta mucho más CPU en el servidor).
  images: { formats: ["image/webp"], minimumCacheTTL: 60 * 60 * 24 * 31 },
  async headers() {
    return [
      {
        source: "/:folder(images|brand)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        source: "/:path*",
        headers: securityHeaders({
          isDev: process.env.NODE_ENV !== "production",
          apiUrl: process.env.NEXT_PUBLIC_API_URL,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        }),
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
