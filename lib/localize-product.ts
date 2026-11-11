import { useTranslations } from "next-intl";

import type { Product } from "@/lib/products";

// El español vive en `lib/products.ts`; en/pt en `messages/*.json` (namespace `Products`).
// Si falta una traducción, se queda el texto en español: nunca se muestra una clave vacía.
type Translator = {
  (key: string): string;
  has: (key: string) => boolean;
  raw: (key: string) => unknown;
};

export function localizeProduct(product: Product, t: Translator): Product {
  const text = (field: string, fallback: string): string => {
    const key = `${product.slug}.${field}`;
    return t.has(key) ? t(key) : fallback;
  };
  const chipsKey = `${product.slug}.chips`;
  return {
    ...product,
    title: text("title", product.title),
    shortDescription: text("shortDescription", product.shortDescription),
    longDescription: text("longDescription", product.longDescription),
    includes: product.includes ? text("includes", product.includes) : product.includes,
    chips: product.chips && t.has(chipsKey) ? (t.raw(chipsKey) as string[]) : product.chips,
  };
}

export function useLocalizeProduct(): (product: Product) => Product {
  const t = useTranslations("Products") as unknown as Translator;
  return (product) => localizeProduct(product, t);
}
