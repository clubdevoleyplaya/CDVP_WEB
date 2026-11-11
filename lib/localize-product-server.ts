import { getTranslations } from "next-intl/server";

import { localizeProduct } from "@/lib/localize-product";
import type { Product } from "@/lib/products";

export async function getLocalizeProduct(): Promise<(product: Product) => Product> {
  const t = (await getTranslations("Products")) as unknown as Parameters<typeof localizeProduct>[1];
  return (product) => localizeProduct(product, t);
}
