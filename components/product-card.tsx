"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TestimonialSlider } from "@/components/testimonial-slider";
import { useLocalizeProduct } from "@/lib/localize-product";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice, formatPrice } from "@/lib/price";
import type { Product } from "@/lib/products";

export function ProductCard({ product: base }: { product: Product }) {
  const product = useLocalizeProduct()(base);
  const t = useTranslations("ProductCard");
  const tc = useTranslations("Categories.single");
  const { currency, isSubscriber, discountPercent, eurPrices, addToCart } = useDemoState();
  const { now, old, showOld } = computeDisplayPrice(product, currency, isSubscriber, discountPercent, eurPrices);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="flex flex-col overflow-hidden rounded-xl border border-line bg-card-bg"
      style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
    >
      {product.image ? (
        <Link prefetch={false}
          href={`/producto/${product.slug}`}
          aria-label={t("view", { title: product.title })}
          className="relative block aspect-video w-full overflow-hidden rounded-t-xl"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover scale-[1.03]"
          />
        </Link>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-line font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
          {t("imageSoon")}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="w-fit rounded-lg bg-blue/10 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wide text-blue">
          {tc(product.category)}
        </p>
        <h3 className="font-display text-2xl font-bold uppercase">
          <Link prefetch={false} href={`/producto/${product.slug}`} className="transition-colors hover:text-blue">
            {product.title}
          </Link>
        </h3>
        <p className="flex-grow text-base text-ink-soft">{product.shortDescription}</p>
        {(product.rating || product.includes) && (
          <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-ink-soft [&>*+*]:before:mr-1.5 [&>*+*]:before:content-['·']">
            {product.rating &&
              (product.testimonials?.length ? (
                <Popover>
                  <PopoverTrigger
                    openOnHover
                    delay={150}
                    className="underline decoration-dotted underline-offset-2 transition-colors hover:text-blue"
                    aria-label={t("viewTestimonials", { title: product.title })}
                  >
                    {product.rating.value}★ ({product.rating.count})
                  </PopoverTrigger>
                  <PopoverContent>
                    <TestimonialSlider items={product.testimonials} />
                    <Link prefetch={false}
                      href={`/producto/${product.slug}`}
                      className="mt-3 block w-fit rounded-lg bg-ink px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-bg transition-colors hover:bg-blue"
                    >
                      {t("viewCourse")}
                    </Link>
                  </PopoverContent>
                </Popover>
              ) : (
                <span>
                  {product.rating.value}★ ({product.rating.count})
                </span>
              ))}
            {product.includes && <span>{t("includes", { items: product.includes })}</span>}
          </p>
        )}
        <div className="mt-1 flex items-baseline gap-2">
          {showOld && (
            <span className="tabular text-sm text-ink-soft line-through">
              {formatPrice(old, currency)}
            </span>
          )}
          <span className="tabular text-xl font-black text-yellow">
            {formatPrice(now, currency)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Link prefetch={false}
            href={`/producto/${product.slug}`}
            className="w-fit rounded-lg bg-ink px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-bg transition-colors hover:bg-blue"
          >
            {t("viewDetail")}
          </Link>
          {!product.waitlist && (
            <button
              type="button"
              onClick={() => addToCart(product.slug)}
              aria-label={t("addToCart", { title: product.title })}
              className="rounded-lg border border-line p-2 text-ink-soft transition-colors hover:border-blue hover:text-blue"
            >
              <ShoppingBag className="size-4" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
