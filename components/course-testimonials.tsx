import { useTranslations } from "next-intl";
import { TestimonialSlider } from "@/components/testimonial-slider";
import type { Product, Testimonial } from "@/lib/products";

// Sección propia de valoración y testimonios del curso (ficha y aula). Sin nada que mostrar, no aparece.
export function CourseTestimonials({
  items,
  rating,
}: {
  items?: Testimonial[];
  rating?: Product["rating"];
}) {
  const t = useTranslations("CourseTestimonials");
  const hasItems = !!items && items.length > 0;
  if (!hasItems && !rating) return null;

  return (
    <section
      aria-label={t("label")}
      className="rounded-xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-blue">
          {t("heading")}
        </h2>
        {rating && (
          <p className="text-sm text-ink-soft">
            <span className="font-display text-lg font-bold text-yellow">{rating.value}★</span>{" "}
            {t("ratings", { count: rating.count })}
          </p>
        )}
      </div>
      {hasItems && <TestimonialSlider items={items} className="mt-4" />}
    </section>
  );
}
