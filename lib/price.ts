import type { Currency } from "@/context/demo-state";
import type { Product } from "@/lib/products";

export function formatPrice(amount: number, currency: Currency) {
  if (currency === "USD") return `$${amount.toLocaleString("en-US")} USD`;
  if (currency === "EUR") return `€${amount.toLocaleString("es-ES")} EUR`;
  return `$${amount.toLocaleString("es-AR")} ARS`;
}

// Precios fijos en euros que un admin ya revisó (`GET /precios-eur`), por slug.
export type EurPrices = Record<string, { price: number; compare: number | null }>;

// Medio de pago por moneda: MercadoPago cobra en pesos; Paddle en dólares o euros.
export function paymentProviderFor(currency: Currency): "mercadopago" | "paddle" {
  return currency === "ARS" ? "mercadopago" : "paddle";
}

export type DiscountPercent = Record<Product["category"], number>;

// Valores iniciales, iguales a los del backend. Se usan mientras llegan (o si no llegan)
// los porcentajes vigentes desde `GET /descuentos`.
export const DEFAULT_DISCOUNT_PERCENT: DiscountPercent = {
  curso: 50,
  evento: 10,
  combo: 0,
  descargable: 0,
};

function basePrices(
  product: Pick<Product, "slug" | "priceArs" | "priceUsd" | "compareArs" | "compareUsd">,
  currency: Currency,
  eurPrices: EurPrices
) {
  if (currency === "USD") return { base: product.priceUsd, compare: product.compareUsd };
  if (currency === "EUR") {
    const eur = eurPrices[product.slug];
    // El euro solo se ofrece con el catálogo completo (ver `eurReady`); sin precio, dólares.
    return eur
      ? { base: eur.price, compare: eur.compare ?? undefined }
      : { base: product.priceUsd, compare: product.compareUsd };
  }
  return { base: product.priceArs, compare: product.compareArs };
}

export function computeDisplayPrice(
  product: Pick<
    Product,
    "slug" | "priceArs" | "priceUsd" | "compareArs" | "compareUsd" | "discountable" | "category"
  >,
  currency: Currency,
  isSubscriber: boolean,
  discountPercent: DiscountPercent = DEFAULT_DISCOUNT_PERCENT,
  eurPrices: EurPrices = {}
) {
  const { base, compare } = basePrices(product, currency, eurPrices);

  if (product.discountable && isSubscriber) {
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
