import { notFound } from "next/navigation";
import { CatalogGrid } from "@/components/catalog-grid";
import {
  CATEGORY_ROUTES,
  CATEGORY_ROUTE_LABELS,
  getProductsByCategory,
  type CategoryRoute,
} from "@/lib/products";

export function generateStaticParams() {
  return Object.keys(CATEGORY_ROUTES).map((categoria) => ({ categoria }));
}

const CATEGORY_NOTES: Partial<Record<CategoryRoute, string>> = {
  cursos: "20% OFF para suscriptores",
  programas: "Sin 20% OFF — la regla vigente aplica solo a cursos y eventos",
};

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
  const note = CATEGORY_NOTES[route];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="font-display text-3xl font-bold uppercase">
          {CATEGORY_ROUTE_LABELS[route]}
        </h1>
        {note && (
          <span
            className={`font-display text-xs font-bold uppercase tracking-wide ${
              route === "cursos" ? "text-green" : "text-ink-soft"
            }`}
          >
            {note}
          </span>
        )}
      </div>
      <div className="mt-8">
        <CatalogGrid items={items} />
      </div>
    </section>
  );
}
