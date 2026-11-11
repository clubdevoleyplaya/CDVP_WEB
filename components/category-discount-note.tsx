"use client";

import { useTranslations } from "next-intl";
import { useDemoState } from "@/context/demo-state";
import type { Category } from "@/lib/products";

export function CategoryDiscountNote({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const t = useTranslations("Catalog");
  const { discountPercent } = useDemoState();
  const percentOff = discountPercent[category];
  if (!percentOff) return null;

  return <span className={className}>{t("subscriberOff", { percent: percentOff })}</span>;
}
