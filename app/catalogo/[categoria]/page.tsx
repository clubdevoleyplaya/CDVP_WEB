import { notFound } from "next/navigation";
import { CatalogGrid } from "@/components/catalog-grid";
import { CategoryDiscountNote } from "@/components/category-discount-note";
import {
  CATEGORY_ROUTES,
  CATEGORY_ROUTE_LABELS,
  getProductsByCategory,
  type CategoryRoute,
} from "@/lib/products";

export function generateStaticParams() {
  return Object.keys(CATEGORY_ROUTES).map((categoria) => ({ categoria }));
}

export default async function CatalogoPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;

  if (!(categoria in CATEGORY_ROUTES)) notFound();
  const route = categoria as CategoryRoute;
  const category = CATEGORY_ROUTES[route];
  const items = getProductsByCategory(category);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="font-display text-3xl font-bold uppercase">
          {CATEGORY_ROUTE_LABELS[route]}
        </h1>
        <CategoryDiscountNote
          category={category}
          className={`font-display text-xs font-bold uppercase tracking-wide ${
            route === "cursos" ? "text-green" : "text-ink-soft"
          }`}
        />
      </div>
      <div className="mt-8">
        <CatalogGrid items={items} />
      </div>
    </section>
  );
}
