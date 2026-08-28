import type { Currency } from "@/context/demo-state";
import type { Product } from "@/lib/products";

export function formatPrice(amount: number, currency: Currency) {
  if (currency === "USD") return `$${amount.toLocaleString("en-US")} USD`;
  return `$${amount.toLocaleString("es-AR")} ARS`;
}

const DISCOUNT_MULTIPLIER_BY_CATEGORY: Partial<Record<Product["category"], number>> = {
  curso: 0.5,
  evento: 0.9,
};

export function computeDisplayPrice(
  product: Pick<
    Product,
    "priceArs" | "priceUsd" | "compareArs" | "compareUsd" | "discountable" | "category"
  >,
  currency: Currency,
  isSubscriber: boolean
) {
  const base = currency === "USD" ? product.priceUsd : product.priceArs;
  const compare = currency === "USD" ? product.compareUsd : product.compareArs;

  if (product.discountable && isSubscriber) {
    const multiplier = DISCOUNT_MULTIPLIER_BY_CATEGORY[product.category] ?? 1;
    return {
      now: Math.round(base * multiplier),
      old: base,
      showOld: multiplier < 1,
    };
  }
  if (compare) {
    return { now: base, old: compare, showOld: true };
  }
  return { now: base, old: base, showOld: false };
}
