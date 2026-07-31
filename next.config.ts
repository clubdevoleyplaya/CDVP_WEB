import type { NextConfig } from "next";

// CSP queda fuera por ahora: todavía no está definida la lista de orígenes
// que va a necesitar permitir (embeds de YouTube/Drive vienen en Fase 3) y
// una CSP mal calibrada rompe el sitio en vez de protegerlo.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
