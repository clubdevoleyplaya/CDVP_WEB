import type { Currency } from "@/context/demo-state";
import type { Product } from "@/lib/products";

export function formatPrice(amount: number, currency: Currency) {
  if (currency === "USD") return `$${amount.toLocaleString("en-US")} USD`;
  return `$${amount.toLocaleString("es-AR")} ARS`;
}

export function computeDisplayPrice(
  product: Pick<Product, "priceArs" | "priceUsd" | "compareArs" | "compareUsd" | "discountable">,
  currency: Currency,
  isSubscriber: boolean
) {
  const base = currency === "USD" ? product.priceUsd : product.priceArs;
  const compare = currency === "USD" ? product.compareUsd : product.compareArs;

  if (product.discountable && isSubscriber) {
    return {
      now: Math.round(base * 0.8),
      old: base,
      showOld: true,
    };
  }
  if (compare) {
    return { now: base, old: compare, showOld: true };
  }
  return { now: base, old: base, showOld: false };
}
