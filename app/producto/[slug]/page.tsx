import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductCard } from "@/components/product-card";
import { ProductVideoSection } from "@/components/product-video-section";
import { QuizSection } from "@/components/quiz-section";
import {
  CATEGORY_LABELS,
  CATEGORY_ROUTE_LABELS,
  CATEGORY_TO_ROUTE,
  getProductBySlug,
  products,
} from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href={`/catalogo/${CATEGORY_TO_ROUTE[product.category]}`}
        className="font-display text-xs font-bold uppercase tracking-wide text-blue hover:underline"
      >
        ← {CATEGORY_ROUTE_LABELS[CATEGORY_TO_ROUTE[product.category]]}
      </Link>

      <p className="mt-6 w-fit rounded-lg bg-blue/10 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wide text-blue">
        {CATEGORY_LABELS[product.category]}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold uppercase">{product.title}</h1>
      <p className="mt-4 max-w-[65ch] text-base text-ink-soft">{product.longDescription}</p>

      {product.chips && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {product.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-lg border border-line font-display text-xs uppercase tracking-wide text-ink-soft px-2 py-1"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}

      {(product.modules || product.rating || product.includes) && (
        <p className="mt-4 text-sm text-ink-soft">
          {product.modules && <>Módulos: {product.modules} · </>}
          {product.rating && (
            <>
              {product.rating.value}★ ({product.rating.count} valoraciones) ·{" "}
            </>
          )}
          {product.includes && <>Incluye: {product.includes}</>}
        </p>
      )}

      <div className="mt-8 max-w-sm">
        <ProductBuyBox product={product} />
      </div>

      <ProductVideoSection slug={product.slug} category={product.category} />
      <QuizSection slug={product.slug} category={product.category} />

      {product.testimonials && product.testimonials.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold uppercase">Lo que dicen los alumnos</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {product.testimonials.map((t) => (
              <blockquote
                key={t.author}
                className="rounded-xl border border-line bg-surface p-5 text-sm italic"
              >
                &ldquo;{t.quote}&rdquo;
                <footer className="mt-3 font-display text-xs font-bold not-italic uppercase tracking-wide text-blue">
                  {t.author} · ★5
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold uppercase">Más productos relacionados</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
