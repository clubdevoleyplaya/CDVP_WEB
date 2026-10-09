// Idioma por defecto de una visita. Función pura: la usa `proxy.ts` y se prueba aparte.
// Orden: lo que la persona eligió (cookie) → idioma del navegador (`Accept-Language`) → español.
// La moneda NO se detecta: la elige la persona con el selector y, mientras no elija, son pesos.
// Así no hace falta saber el país de la visita ni poner un servicio (Cloudflare) delante.

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

export type DetectInput = {
  localeCookie?: string | null;
  acceptLanguage?: string | null;
};

export function detectLocale({ localeCookie, acceptLanguage }: DetectInput): Locale {
  if (isLocale(localeCookie)) return localeCookie;
  return localeFromAcceptLanguage(acceptLanguage);
}

export function currencyFromCookie(value: string | null | undefined): Currency {
  return isCurrency(value) ? value : DEFAULT_CURRENCY;
}
