"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { Testimonial } from "@/lib/products";

// Deslizable de testimonios (texto e imagen, nunca video): scroll-snap con puntos, sin librería.
type Item = Testimonial & { productSlug?: string; productTitle?: string };

const AUTO_PLAY_MS = 6000;

export function TestimonialSlider({
  items,
  className = "",
  autoPlay = false,
}: {
  items: Item[];
  className?: string;
  // Pasa solo al siguiente cada unos segundos; se detiene con el mouse o el foco encima y si la
  // persona pidió menos movimiento.
  autoPlay?: boolean;
}) {
  const tt = useTranslations("TestimonialSlider");
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  function goTo(i: number) {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    if (!autoPlay || paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => goTo((active + 1) % items.length), AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [autoPlay, paused, active, items.length]);

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
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
