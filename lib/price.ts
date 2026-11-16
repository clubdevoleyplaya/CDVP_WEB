import type { Currency } from "@/context/app-state";
import type { Product } from "@/lib/products";

export function formatPrice(amount: number, currency: Currency) {
  if (currency === "USD") return `$${amount.toLocaleString("en-US")} USD`;
  if (currency === "EUR") return `€${amount.toLocaleString("es-ES")} EUR`;
  return `$${amount.toLocaleString("es-AR")} ARS`;
}

// Precios del catálogo por slug, tal como los devuelve `GET /precios` (única fuente de precios).
// `eur` solo viene cuando un admin ya revisó el precio en euros.
export type PriceEntry = {
  ars: number;
  usd: number;
  compareArs: number | null;
  compareUsd: number | null;
  eur: number | null;
  compareEur: number | null;
  discountable: boolean;
};
export type Prices = Record<string, PriceEntry>;
// El euro se ofrece solo cuando un admin revisó el precio de todo el catálogo.
export type PriceCatalog = { prices: Prices; eurComplete: boolean };

export const EMPTY_PRICE_CATALOG: PriceCatalog = { prices: {}, eurComplete: false };

const num = (v: unknown) => (v == null ? null : Number(v));

export function parsePriceCatalog(data: unknown): PriceCatalog {
  const raw = data as { precios?: Record<string, Record<string, unknown>>; eur_completo?: boolean } | null;
  const prices: Prices = {};
  for (const [slug, p] of Object.entries(raw?.precios ?? {})) {
    prices[slug] = {
      ars: Number(p.ars),
      usd: Number(p.usd),
      compareArs: num(p.compare_ars),
      compareUsd: num(p.compare_usd),
      eur: num(p.eur),
      compareEur: num(p.compare_eur),
      discountable: p.discountable === true,
    };
  }
  return { prices, eurComplete: raw?.eur_completo === true };
}

// Medio de pago por moneda: MercadoPago cobra en pesos; Paddle en dólares o euros.
export function paymentProviderFor(currency: Currency): "mercadopago" | "paddle" {
  return currency === "ARS" ? "mercadopago" : "paddle";
}

export type DiscountPercent = Record<Product["category"], number>;

// Valores iniciales, iguales a los del backend. Se usan mientras llegan (o si no llegan)
// los porcentajes vigentes desde `GET /descuentos`.
export const DEFAULT_DISCOUNT_PERCENT: DiscountPercent = {
  curso: 15,
  evento: 10,
  combo: 0,
  descargable: 0,
};

function basePrices(entry: PriceEntry, currency: Currency) {
  if (currency === "USD") return { base: entry.usd, compare: entry.compareUsd };
  // El euro solo se ofrece con el catálogo completo (ver `eurComplete`); sin precio, dólares.
  if (currency === "EUR" && entry.eur != null) return { base: entry.eur, compare: entry.compareEur };
  if (currency === "EUR") return { base: entry.usd, compare: entry.compareUsd };
  return { base: entry.ars, compare: entry.compareArs };
}

export type DisplayPrice = { now: number; old: number; showOld: boolean };

// null si el precio del producto todavía no llegó de la API: no se muestra ni se cobra un valor inventado.
export function computeDisplayPrice(
  product: Pick<Product, "slug" | "category">,
  currency: Currency,
  isSubscriber: boolean,
  discountPercent: DiscountPercent = DEFAULT_DISCOUNT_PERCENT,
  prices: Prices = {}
): DisplayPrice | null {
  const entry = prices[product.slug];
  if (!entry) return null;
  const { base, compare } = basePrices(entry, currency);

  if (entry.discountable && isSubscriber) {
    const percentOff = discountPercent[product.category] ?? 0;
    return {
      now: Math.round(base * (1 - percentOff / 100) * 100) / 100,
      old: base,
      showOld: percentOff > 0,
    };
  }
  if (compare) {
    return { now: base, old: compare, showOld: true };
  }
  return { now: base, old: base, showOld: false };
}
