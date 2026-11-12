import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CATEGORY_TO_ROUTE, products, type Category, type Product } from "@/lib/products";
import { getLocalizeProduct } from "@/lib/localize-product-server";
import { formatPrice } from "@/lib/price";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pricing");
  return { title: t("metaTitle") };
}

const ORDER: Category[] = ["curso", "combo", "descargable", "evento"];
function ProductRow({ product }: { product: Product }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-line py-3">
      <Link href={`/producto/${product.slug}`} className="font-bold text-ink hover:underline">
        {product.title}
      </Link>
      <span className="tabular whitespace-nowrap font-bold">
        {formatPrice(product.priceUsd, "USD")}
      </span>
    </li>
  );
}

export default async function PricingPage() {
  const t = await getTranslations("Pricing");
  const tc = await getTranslations("Categories.routes");
  const localize = await getLocalizeProduct();
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold uppercase leading-none">{t("title")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t("intro")}
      </p>

      <div className="mt-8 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-base font-bold uppercase">{t("membership")}</h2>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="tabular text-sm text-ink-soft line-through">$15 USD</span>
          <span className="tabular text-2xl font-black text-yellow">$9 USD</span>
          <span className="text-sm text-ink-soft">{t("perMonth")}</span>
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {t("membershipText")}
        </p>
        <Link href="/suscripcion" className="mt-3 inline-block text-sm font-bold underline">
          {t("seeMembership")}
        </Link>
      </div>

      {ORDER.map((category) => {
        const items = products.filter((p) => p.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="mt-8">
            <h2 className="font-display text-base font-bold uppercase">
              {tc(CATEGORY_TO_ROUTE[category])}
            </h2>
            <ul className="mt-2 text-sm">
              {items.map((product) => (
                <ProductRow key={product.slug} product={localize(product)} />
              ))}
            </ul>
            <Link
              href={`/catalogo/${CATEGORY_TO_ROUTE[category]}`}
              className="mt-2 inline-block text-xs font-bold uppercase tracking-wide text-ink-soft underline"
            >
              {t("seeCatalog")}
            </Link>
          </div>
        );
      })}
    </section>
  );
}
