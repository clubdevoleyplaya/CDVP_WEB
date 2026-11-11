"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { Testimonial } from "@/lib/products";

// Deslizable de testimonios (texto e imagen, nunca video): scroll-snap con puntos, sin librería.
type Item = Testimonial & { productSlug?: string; productTitle?: string };

export function TestimonialSlider({
  items,
  className = "",
}: {
  items: Item[];
  className?: string;
}) {
  const tt = useTranslations("TestimonialSlider");
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(i: number) {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className={className}>
      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => (
          <figure key={`${t.author}-${t.quote ?? t.image}`} className="w-full shrink-0 snap-center px-1">
            {t.image && (
              <Image
                src={t.image}
                alt={tt("imageAlt", { author: t.author })}
                width={640}
                height={400}
                className="mb-3 h-auto w-full rounded-lg border border-line"
              />
            )}
            {t.quote && <blockquote className="text-base italic">&ldquo;{t.quote}&rdquo;</blockquote>}
            <figcaption className="mt-3 font-display text-xs font-bold uppercase tracking-wide text-blue">
              {t.author} · ★5
              {t.productSlug && (
                <>
                  {" "}
                  <Link href={`/producto/${t.productSlug}`} className="underline">
                    {t.productTitle}
                  </Link>
                </>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-3 flex justify-center gap-2" role="group" aria-label={tt("choose")}>
          {items.map((t, i) => (
            <button
              key={`${t.author}-${i}`}
              type="button"
              aria-label={tt("item", { index: i + 1, total: items.length })}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-blue" : "w-2 bg-line"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
