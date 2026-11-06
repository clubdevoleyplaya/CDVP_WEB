"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";

import type { Product } from "@/lib/products";

type Lesson = { position: number; section: string | null; title: string };

// Vista previa para quien aún no tiene el curso: el aula difuminada con el temario real (solo títulos).
export function CoursePreview({ product }: { product: Product }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${product.slug}/syllabus`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setLessons(data.lessons ?? []))
      .catch(() => {});
  }, [product.slug]);

  if (lessons.length === 0) return null;

  return (
    <section className="mt-10" aria-label="Contenido del curso">
      <h2 className="font-display text-xl font-bold uppercase">Así es el curso por dentro</h2>
      <p className="mt-1 text-sm text-ink-soft">
        {lessons.length} clases. Se desbloquean al comprar el curso.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-surface">
          {product.image && (
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="scale-110 object-cover blur-md"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="flex size-14 items-center justify-center rounded-full bg-bg/90 text-ink">
              <Lock className="size-6" />
            </span>
          </div>
        </div>
        <ol className="max-h-72 overflow-hidden rounded-xl border border-line [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
          {lessons.map((l, i) => (
            <li key={l.position}>
              {l.section && l.section !== lessons[i - 1]?.section && (
                <p className="border-b border-line px-3 pt-3 pb-1 font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
                  {l.section}
                </p>
              )}
              <p className="flex items-center gap-3 px-3 py-2 text-sm text-ink-soft">
                <Lock className="size-3.5 shrink-0" />
                {l.title}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
