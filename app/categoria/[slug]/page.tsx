import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/product-card";
import { CATEGORY_PAGES, CUSTOM_SERVICES, categoryGroups, isCategoryPageSlug } from "@/lib/menu";
import { getProductBySlug } from "@/lib/products";

export function generateStaticParams() {
  return Object.keys(CATEGORY_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategoryPageSlug(slug)) return {};
  const t = await getTranslations("Menu");
  return { title: `${t(CATEGORY_PAGES[slug].key)} — Club de Voley Playa` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isCategoryPageSlug(slug)) notFound();
  const page = CATEGORY_PAGES[slug];
  const t = await getTranslations("Menu");
  const tc = await getTranslations("CategoryPage");
  const groups = categoryGroups(page);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold uppercase">{t(page.key)}</h1>
      <p className="mt-3 max-w-[65ch] text-base text-ink-soft">{tc(`${page.key}.intro`)}</p>

      {groups.map((group) => {
        const items = group.products.map(getProductBySlug).filter((p) => p !== undefined);
        if (items.length === 0) return null;
        return (
          <div key={group.key ?? "all"} className="mt-10">
            {group.key && (
              <h2 className="font-display text-xl font-bold uppercase">
                {tc(`groups.${group.key}`)}
              </h2>
            )}
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        );
      })}

      {slug === "personalizado" && (
        <>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {CUSTOM_SERVICES.map((service) => (
              <li key={service} className="rounded-xl border border-line bg-surface p-6">
                <h2 className="font-display text-lg font-bold uppercase">
                  {tc(`services.${service}.title`)}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">{tc(`services.${service}.text`)}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="mt-8 inline-block rounded-lg bg-blue px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:brightness-110"
          >
            {tc("services.cta")}
          </Link>
        </>
      )}
    </section>
  );
}
