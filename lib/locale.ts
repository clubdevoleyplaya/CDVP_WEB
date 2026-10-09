// Idioma y divisa por defecto de una visita. Función pura: la usa `proxy.ts` y se prueba aparte.
// Orden: lo que la persona eligió (cookie) → señal del navegador o del país → español y pesos.
// No se consulta ningún servicio externo de geolocalización: la IP de cada visita no sale de acá.

export const LOCALES = ["es", "en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export type Currency = "ARS" | "USD";

export const LOCALE_COOKIE = "cdvp_locale";
export const CURRENCY_COOKIE = "cdvp_currency";
export const DEFAULT_LOCALE: Locale = "es";
export const DEFAULT_CURRENCY: Currency = "ARS";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function isCurrency(value: unknown): value is Currency {
  return value === "ARS" || value === "USD";
}

type Preference = { tag: string; q: number };

function parseAcceptLanguage(header: string | null | undefined): Preference[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((p) => p.tag && p.tag !== "*" && p.q > 0)
    .sort((a, b) => b.q - a.q);
}

export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  for (const { tag } of parseAcceptLanguage(header)) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

// Región (`AR` en `es-AR`) de la primera preferencia que traiga una.
function regionFromAcceptLanguage(header: string | null | undefined): string | null {
  for (const { tag } of parseAcceptLanguage(header)) {
    const region = tag.split("-")[1];
    if (region && /^[a-z]{2}$/.test(region)) return region.toUpperCase();
  }
  return null;
}

export function currencyFromCountry(country: string | null | undefined): Currency | null {
  const code = country?.trim().toUpperCase();
  // `XX` y `T1` son valores de relleno de Cloudflare (país desconocido, Tor).
  if (!code || !/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return null;
  return code === "AR" ? "ARS" : "USD";
}

export type DetectInput = {
  localeCookie?: string | null;
  currencyCookie?: string | null;
  acceptLanguage?: string | null;
  // Encabezado de país que agrega un proxy delante (Cloudflare, Vercel). Railway no lo agrega.
  country?: string | null;
};

export function detectLocale({ localeCookie, acceptLanguage }: DetectInput): Locale {
  if (isLocale(localeCookie)) return localeCookie;
  return localeFromAcceptLanguage(acceptLanguage);
}

export function detectCurrency({
  currencyCookie,
  acceptLanguage,
  country,
}: DetectInput): Currency {
  if (isCurrency(currencyCookie)) return currencyCookie;
  const fromCountry = currencyFromCountry(country);
  if (fromCountry) return fromCountry;
  const region = regionFromAcceptLanguage(acceptLanguage);
  if (region) return region === "AR" ? "ARS" : "USD";
  return DEFAULT_CURRENCY;
}
