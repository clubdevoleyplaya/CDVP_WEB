"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice, formatPrice } from "@/lib/price";
import { CATEGORY_LABELS, type Product } from "@/lib/products";

const PLACEHOLDER_SLIDES = [1, 2, 3];

export function ProductCard({ product }: { product: Product }) {
  const { currency, isSubscriber, addToCart } = useDemoState();
  const { now, old, showOld } = computeDisplayPrice(product, currency, isSubscriber);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface"
    >
      <Carousel className="group w-full">
        <CarouselContent className="ml-0">
          {PLACEHOLDER_SLIDES.map((i) => (
            <CarouselItem key={i} className="pl-0">
              <div className="flex aspect-video items-center justify-center bg-line font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
                Imagen {i}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-7 opacity-0 transition-opacity group-hover:opacity-100" />
        <CarouselNext className="right-2 size-7 opacity-0 transition-opacity group-hover:opacity-100" />
      </Carousel>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="w-fit rounded-lg bg-blue/10 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wide text-blue">
          {CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="font-display text-lg font-bold uppercase">{product.title}</h3>
        <p className="flex-grow text-sm text-ink-soft">{product.shortDescription}</p>
        {(product.modules || product.rating || product.includes) && (
          <p className="text-xs text-ink-soft">
            {product.modules && <>Módulos: {product.modules} · </>}
            {product.rating && (
              <>
                {product.rating.value}★ ({product.rating.count}) ·{" "}
              </>
            )}
            {product.includes && <>Incluye: {product.includes}</>}
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
          <Link
            href={`/producto/${product.slug}`}
            className="w-fit rounded-lg bg-ink px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-bg transition-colors hover:bg-blue"
          >
            Ver detalle
          </Link>
          <button
            type="button"
            onClick={() => addToCart(product.slug)}
            aria-label={`Agregar ${product.title} al carrito`}
            className="rounded-lg border border-line p-2 text-ink-soft transition-colors hover:border-blue hover:text-blue"
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
