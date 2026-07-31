import Link from "next/link";
import { Hero } from "@/components/hero";
import { WelcomePack } from "@/components/welcome-pack";
import { Bio } from "@/components/bio";
import { Why } from "@/components/why";
import { Testimonials } from "@/components/testimonials";
import { ProductCard } from "@/components/product-card";
import { getProductBySlug, CATEGORY_ROUTE_LABELS, type CategoryRoute } from "@/lib/products";

const FEATURED_SLUGS = [
  "ataque",
  "copia-de-programa-beach-voley-pro",
  "analisis-tecnico-biomecanico",
  "todos-los-cursos",
] as const;

const CATEGORY_ROUTES: CategoryRoute[] = ["cursos", "programas", "descargables", "combos"];

export default function Home() {
  const featured = FEATURED_SLUGS.map(getProductBySlug).filter((p) => p !== undefined);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <WelcomePack />
      </section>

      <Bio />
      <Why />

      <section id="destacados" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold uppercase">Destacados</h2>
          <div className="flex flex-wrap gap-4">
            {CATEGORY_ROUTES.map((route) => (
              <Link
                key={route}
                href={`/catalogo/${route}`}
                className="font-display text-xs font-bold uppercase tracking-wide text-blue hover:underline"
              >
                Ver {CATEGORY_ROUTE_LABELS[route]} →
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <Testimonials />
    </>
  );
}
