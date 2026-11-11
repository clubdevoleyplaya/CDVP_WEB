import Link from "next/link";
import { useTranslations } from "next-intl";
import { Hero } from "@/components/hero";
import { WelcomePack } from "@/components/welcome-pack";
import { Bio } from "@/components/bio";
import { Why } from "@/components/why";
import { Testimonials } from "@/components/testimonials";
import { ProductCard } from "@/components/product-card";
import { getProductBySlug, type CategoryRoute } from "@/lib/products";

const FEATURED_SLUGS = [
  "ataque",
  "recepcion",
  "analisis-tecnico-biomecanico",
  "todos-los-cursos",
] as const;

const CATEGORY_ROUTES: CategoryRoute[] = ["cursos", "descargables", "combos", "eventos"];

export default function Home() {
  const t = useTranslations("Home");
  const tc = useTranslations("Categories.routes");
  const featured = FEATURED_SLUGS.map(getProductBySlug).filter((p) => p !== undefined);

  return (
    <>
      <WelcomePack />
      <Hero />

      <Bio />
      <Why />

      <section id="destacados" className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold uppercase">{t("featured")}</h2>
          <div className="flex flex-wrap gap-4">
            {CATEGORY_ROUTES.map((route) => (
              <Link
                key={route}
                href={`/catalogo/${route}`}
                className="font-display text-xs font-bold uppercase tracking-wide text-blue hover:underline"
              >
                {t("seeCategory", { category: tc(route) })}
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
