import { TestimonialSlider } from "@/components/testimonial-slider";
import type { Testimonial } from "@/lib/products";

// Sección propia de testimonios del curso (ficha y aula). Sin testimonios no se muestra.
export function CourseTestimonials({ items }: { items?: Testimonial[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-label="Testimonios"
      className="rounded-xl border border-line bg-surface p-5 sm:p-6"
    >
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-blue">
        Lo que dicen los alumnos
      </h2>
      <TestimonialSlider items={items} className="mt-4" />
    </section>
  );
}
