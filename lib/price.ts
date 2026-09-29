import type { Currency } from "@/context/demo-state";
import type { Product } from "@/lib/products";

export function formatPrice(amount: number, currency: Currency) {
  if (currency === "USD") return `$${amount.toLocaleString("en-US")} USD`;
  return `$${amount.toLocaleString("es-AR")} ARS`;
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

export function computeDisplayPrice(
  product: Pick<
    Product,
    "priceArs" | "priceUsd" | "compareArs" | "compareUsd" | "discountable" | "category"
  >,
  currency: Currency,
  isSubscriber: boolean,
  discountPercent: DiscountPercent = DEFAULT_DISCOUNT_PERCENT
) {
  const base = currency === "USD" ? product.priceUsd : product.priceArs;
  const compare = currency === "USD" ? product.compareUsd : product.compareArs;

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
