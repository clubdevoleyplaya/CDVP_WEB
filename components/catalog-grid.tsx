"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice } from "@/lib/price";
import type { Product } from "@/lib/products";

type SortBy = "relevancia" | "precio-asc" | "precio-desc" | "mejor-valorados";

const SORT_LABELS: Record<SortBy, string> = {
  relevancia: "Relevancia",
  "precio-asc": "Precio ↑",
  "precio-desc": "Precio ↓",
  "mejor-valorados": "Mejor valorados",
};

export function CatalogGrid({ items }: { items: Product[] }) {
  const { currency, isSubscriber, discountPercent, eurPrices } = useDemoState();
  const [sortBy, setSortBy] = useState<SortBy>("relevancia");
  const [onlyDiscountable, setOnlyDiscountable] = useState(false);

  const visible = useMemo(() => {
    let result = onlyDiscountable ? items.filter((p) => p.discountable) : items;

    if (sortBy === "mejor-valorados") {
      result = [...result].sort(
        (a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0),
      );
    } else if (sortBy === "precio-asc" || sortBy === "precio-desc") {
      const withPrice = result.map((p) => ({
        product: p,
        price: computeDisplayPrice(p, currency, isSubscriber, discountPercent, eurPrices).now,
      }));
      withPrice.sort((a, b) =>
        sortBy === "precio-asc" ? a.price - b.price : b.price - a.price,
      );
      result = withPrice.map((w) => w.product);
    }

    return result;
  }, [items, sortBy, onlyDiscountable, currency, isSubscriber, discountPercent, eurPrices]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide transition-colors ${
      active
        ? "border-ink bg-ink text-bg"
        : "border-line text-ink-soft hover:border-blue hover:text-blue"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="text-sm text-ink-soft">
          {visible.length} {visible.length === 1 ? "producto" : "productos"}
        </p>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Ordenar por">
          <span className="font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
            Ordenar
          </span>
          {(Object.keys(SORT_LABELS) as SortBy[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={sortBy === key}
              onClick={() => setSortBy(key)}
              className={chip(sortBy === key)}
            >
              {SORT_LABELS[key]}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={onlyDiscountable}
          onClick={() => setOnlyDiscountable((v) => !v)}
          className={chip(onlyDiscountable)}
        >
          Con descuento para suscriptores
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
