"use client";

import { useDemoState } from "@/context/demo-state";
import type { Category } from "@/lib/products";

export function CategoryDiscountNote({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const { discountPercent } = useDemoState();
  const percentOff = discountPercent[category];
  if (!percentOff) return null;

  return <span className={className}>{percentOff}% OFF para suscriptores</span>;
}
