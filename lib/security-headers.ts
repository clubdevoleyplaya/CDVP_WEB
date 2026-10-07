// Cabeceras de seguridad del sitio. El CSP se publica en modo "solo reporte": el navegador anota
// en la consola lo que bloquearía, sin bloquear nada. Cuando no queden avisos en las pantallas
// reales (login, catálogo, checkout de Paddle, videos), se cambia a enforced.
//
// Límite conocido: script-src lleva 'unsafe-inline' porque Next.js inyecta scripts inline para
// hidratar y el layout tiene el script del tema. Una versión estricta necesita nonces por
// petición (en proxy.ts), lo que obliga a renderizar todo de forma dinámica.

type SecurityEnv = {
  isDev: boolean;
  apiUrl?: string;
  supabaseUrl?: string;
};

function originOf(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function buildCsp({ isDev, apiUrl, supabaseUrl }: SecurityEnv): string {
  const api = originOf(apiUrl);
  const supabase = originOf(supabaseUrl);
  const supabaseWs = supabase ? supabase.replace(/^http/, "ws") : null;

  const directives: Record<string, (string | null | false)[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "https://cdn.paddle.com", isDev && "'unsafe-eval'"],
    "style-src": ["'self'", "'unsafe-inline'", "https://cdn.paddle.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", api, supabase, supabaseWs, "https://*.paddle.com"],
    "frame-src": [
      "https://player.vimeo.com",
      "https://www.youtube.com",
      "https://www.youtube-nocookie.com",
      "https://*.paddle.com",
    ],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.filter(Boolean).join(" ")}`)
    .join("; ");
}

export function securityHeaders(env: SecurityEnv): { key: string; value: string }[] {
  const headers = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Content-Security-Policy-Report-Only", value: buildCsp(env) },
  ];
  // Un año, sin includeSubDomains ni preload: no se arrastra a subdominios que no tengan HTTPS
  // (hay registros DNS de terceros en el dominio) y el navegador ignora HSTS sobre http local.
  if (!env.isDev) {
    headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000" });
  }
  return headers;
}
