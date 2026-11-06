import { notFound } from "next/navigation";
import Link from "next/link";
import { CourseTestimonials } from "@/components/course-testimonials";
import { CoursePreview } from "@/components/course-preview";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductCard } from "@/components/product-card";
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
    <section className="mx-auto max-w-[90rem] px-6 py-16 lg:px-10">
      <Link
        href={`/catalogo/${CATEGORY_TO_ROUTE[product.category]}`}
        className="font-display text-xs font-bold uppercase tracking-wide text-blue hover:underline"
      >
        ← {CATEGORY_ROUTE_LABELS[CATEGORY_TO_ROUTE[product.category]]}
      </Link>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <p className="w-fit rounded-lg bg-blue/10 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wide text-blue">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">
            {product.title}
          </h1>
          <p className="mt-4 max-w-[65ch] text-base text-ink-soft">
            {product.longDescription}
          </p>

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
                  {product.rating.value}★ ({product.rating.count} valoraciones)
                  {product.includes && " · "}
                </>
              )}
              {product.includes && <>Incluye: {product.includes}</>}
            </p>
          )}
        </div>
        <div className="lg:sticky lg:top-24">
          <ProductBuyBox product={product} />
        </div>
      </div>

      {product.category === "curso" && <CoursePreview product={product} />}

      <QuizSection slug={product.slug} category={product.category} />

      <div className="mt-16">
        <CourseTestimonials items={product.testimonials} />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold uppercase">
            Más productos relacionados
          </h2>
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
