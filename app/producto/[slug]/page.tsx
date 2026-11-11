import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CourseTestimonials } from "@/components/course-testimonials";
import { CoursePreview } from "@/components/course-preview";
import { HideWhenOwned } from "@/components/hide-when-owned";
import { ProductBuyBox } from "@/components/product-buy-box";
import { WaitlistForm } from "@/components/waitlist-form";
import { ProductCard } from "@/components/product-card";
import { VideoPlayer } from "@/components/video-player";
import { QuizSection } from "@/components/quiz-section";
import { getLocalizeProduct } from "@/lib/localize-product-server";
import {
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
  const t = await getTranslations("ProductPage");
  const tr = await getTranslations("Categories.routes");
  const ts = await getTranslations("Categories.single");
  const base = getProductBySlug(slug);
  if (!base) notFound();
  const localize = await getLocalizeProduct();
  const product = localize(base);

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-[90rem] px-6 py-16 lg:px-10">
      <Link
        href={`/catalogo/${CATEGORY_TO_ROUTE[product.category]}`}
        className="font-display text-xs font-bold uppercase tracking-wide text-blue hover:underline"
      >
        ← {tr(CATEGORY_TO_ROUTE[product.category])}
      </Link>

      <p className="mt-6 w-fit rounded-lg bg-blue/10 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wide text-blue">
        {ts(product.category)}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold uppercase">{product.title}</h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 lg:flex-1">
          {product.vslVimeoId && (
            <div className="max-w-3xl">
              <VideoPlayer provider="vimeo" videoId={product.vslVimeoId} />
            </div>
          )}
          <p className="mt-4 max-w-[65ch] text-base text-ink-soft">{product.longDescription}</p>
          {product.includes && (
            <p className="mt-4 text-sm text-ink-soft">{t("includes", { items: product.includes })}</p>
          )}
        </div>
        <HideWhenOwned slug={product.slug}>
          <CourseTestimonials items={product.testimonials} rating={product.rating} />
        </HideWhenOwned>
        <div className="lg:w-72 lg:shrink-0">
          {product.waitlist ? <WaitlistForm slug={product.slug} /> : <ProductBuyBox product={product} />}
        </div>
      </div>

      {product.category === "curso" && <CoursePreview product={product} />}

      <QuizSection slug={product.slug} category={product.category} />

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold uppercase">
            {t("related")}
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
