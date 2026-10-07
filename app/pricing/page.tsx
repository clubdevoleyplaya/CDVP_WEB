import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_LABELS, products, type Category, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/price";

export const metadata: Metadata = { title: "Precios — Club de Voley Playa" };

const ORDER: Category[] = ["curso", "combo", "descargable", "evento"];
const ROUTE_BY_CATEGORY: Record<Category, string> = {
  curso: "cursos",
  combo: "combos",
  descargable: "descargables",
  evento: "eventos",
};

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

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">Precios</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Todos los precios están en dólares (USD). Pago único, salvo la membresía, que es mensual.
      </p>

      <div className="mt-8 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-base font-bold uppercase">Membresía</h2>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="tabular text-sm text-ink-soft line-through">$15 USD</span>
          <span className="tabular text-2xl font-black text-yellow">$9 USD</span>
          <span className="text-sm text-ink-soft">por mes</span>
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Incluye el Pack de Bienvenida, los ejercicios que se liberan cada mes y descuentos en
          cursos y eventos mientras la suscripción esté al día. Se cancela cuando quieras.
        </p>
        <Link href="/suscripcion" className="mt-3 inline-block text-sm font-bold underline">
          Ver la membresía
        </Link>
      </div>

      {ORDER.map((category) => {
        const items = products.filter((p) => p.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="mt-8">
            <h2 className="font-display text-base font-bold uppercase">
              {CATEGORY_LABELS[category]}
              {items.length > 1 ? "s" : ""}
            </h2>
            <ul className="mt-2 text-sm">
              {items.map((product) => (
                <ProductRow key={product.slug} product={product} />
              ))}
            </ul>
            <Link
              href={`/catalogo/${ROUTE_BY_CATEGORY[category]}`}
              className="mt-2 inline-block text-xs font-bold uppercase tracking-wide text-ink-soft underline"
            >
              Ver catálogo
            </Link>
          </div>
        );
      })}
    </section>
  );
}
