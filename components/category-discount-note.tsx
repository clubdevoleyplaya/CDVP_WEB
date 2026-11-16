"use client";

import { useTranslations } from "next-intl";
import { useAppState } from "@/context/app-state";
import type { Category } from "@/lib/products";

export function CategoryDiscountNote({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const t = useTranslations("Catalog");
  const { discountPercent } = useAppState();
  const percentOff = discountPercent[category];
  if (!percentOff) return null;

  return <span className={className}>{t("subscriberOff", { percent: percentOff })}</span>;
}
