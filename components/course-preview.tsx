"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Product } from "@/lib/products";
import { useOwnedProduct } from "@/lib/use-owned-product";

type Lesson = { position: number; section: string | null; title: string };

// Temario del curso en la ficha: bloqueado y borroso sin el curso; con el curso se "desbloquea" aquí mismo
// y cada clase entra al aula.
export function CoursePreview({ product }: { product: Product }) {
  const t = useTranslations("CoursePreview");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const owned = useOwnedProduct(product.slug) === true;
  const Icon = owned ? PlayCircle : Lock;

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${product.slug}/syllabus`,
    )
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setLessons(data.lessons ?? []))
      .catch(() => {});
  }, [product.slug]);

  if (lessons.length === 0) return null;

  const groups: {
    position: number;
    section: string | null;
    items: Lesson[];
  }[] = [];
  for (const l of lessons) {
    const last = groups[groups.length - 1];
    if (last && last.section === l.section) last.items.push(l);
    else groups.push({ position: l.position, section: l.section, items: [l] });
  }

  return (
    <section
      aria-label={t("label")}
      className="mt-10 overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="relative h-28 bg-surface">
        {product.image && (
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className={`object-cover transition-[filter] duration-500 ${owned ? "" : "scale-110 blur-md"}`}
          />
        )}
        <div className="absolute inset-0 flex items-center gap-4 bg-black/45 px-5 text-white">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bg/90 text-ink">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold uppercase">
              {t("heading")}
            </h2>
            <p className="text-sm">
              {owned
                ? t("unlocked", { count: lessons.length })
                : t("locked", { count: lessons.length })}
            </p>
          </div>
          {owned && (
            <Link
              href={`/curso/${product.slug}`}
              className="ml-auto rounded-lg bg-bg px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-yellow"
            >
              {t("goCourse")}
            </Link>
          )}
        </div>
      </div>
      <div className={`max-h-[26rem] gap-x-6 overflow-hidden md:columns-2 xl:columns-3 ${owned ? "" : "[mask-image:linear-gradient(to_bottom,black_75%,transparent)]"}`}>
        {groups.map((g) => (
          <div key={g.position} className="break-inside-avoid">
            {g.section && (
              <p className="border-b border-line bg-bg/40 px-4 pt-3 pb-1 font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
                {g.section}
              </p>
            )}
            {g.items.map((l) => (
              owned ? (
                <Link
                  key={l.position}
                  href={`/curso/${product.slug}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-blue/10 hover:text-blue"
                >
                  <PlayCircle className="size-3.5 shrink-0 text-blue" />
                  {l.title}
                </Link>
              ) : (
                <p
                  key={l.position}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-ink-soft"
                >
                  <Lock className="size-3.5 shrink-0" />
                  {l.title}
                </p>
              )
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
