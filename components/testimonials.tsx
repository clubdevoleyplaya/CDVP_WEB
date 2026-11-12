import { SectionHeading } from "@/components/section-heading";
import { useTranslations } from "next-intl";
import { TestimonialSlider } from "@/components/testimonial-slider";
import { useLocalizeProduct } from "@/lib/localize-product";
import { getProductBySlug, products } from "@/lib/products";

// Testimonios en texto: el dato vive en `lib/products.ts` (campo
// `testimonials` de cada producto, fuente única) y se muestra tanto acá
// (landing, agrupado por curso) como en /producto/[slug] — ver
// spec_00_testimonios-landing.md.
//
// Dos citas quedan sin asignar (ninguna nombra un curso identificable):
// "Gracias Juli por explicar fácil..." (Diego Huicy) y "Desde Side Out
// Volleyball Club en Venezuela recomendamos este curso..." (Lenhil Linares).
// Pendiente que Juli confirme a qué curso corresponden — no se inventa. Ver
// TODO.md, Fase 3.
const TEXT_TESTIMONIALS = products.flatMap((p) =>
  (p.testimonials ?? []).map((t) => ({ ...t, productSlug: p.slug, productTitle: p.title })),
);

// IDs de Vimeo de la planilla de Juli ("Testimonios (videos)", re-subidos el 2026-11-12).
// Formato vertical (9:16).
const CAMPUS_VIDEO_IDS = [
  "1246307227", // Phoenix 1
  "1246307201", // Phoenix 2
  "1246307200", // Phoenix 3
  "1246308119", // Santiago 1
  "1246308062", // Santiago 2
  "1246308113", // Santiago 3
  "1246308121", // Santiago 4
  "1246308138", // Santiago 5
  "1246307763", // Guanaqueros 1
  "1246307747", // Guanaqueros 2
  "1246307756", // Guanaqueros 3
];

const CAMPAMENTO_VIDEO_IDS = ["1246308293", "1246308294"];

// Campus: todos mezclados sin distinción de sede, es el bloque de mayor
// volumen y contenido general del club (spec_00_testimonios-landing.md).
const VIDEO_TESTIMONIALS: { context: string; videoId: string | null }[] = [
  { context: "1:1 Beach Volley Lab", videoId: null },
  ...CAMPUS_VIDEO_IDS.map((videoId) => ({ context: "Campus", videoId })),
];

function VideoCard({ context, videoId }: { context: string; videoId: string | null }) {
  const t = useTranslations("Testimonials");
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-card-bg">
      {videoId ? (
        <div className="aspect-[9/16] w-full">
          <iframe
            className="h-full w-full"
            src={`https://player.vimeo.com/video/${videoId}?dnt=1`}
            title={t("videoTitle", { context })}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-[9/16] w-full items-center justify-center bg-line font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
          {t("videoSoon")}
        </div>
      )}
      <figcaption className="p-3 font-display text-xs font-bold uppercase tracking-wide text-blue">
        {context}
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const t = useTranslations("Testimonials");
  const localize = useLocalizeProduct();
  const textTestimonials = TEXT_TESTIMONIALS.map((item) => {
    const product = getProductBySlug(item.productSlug);
    return product ? { ...item, productTitle: localize(product).title } : item;
  });
  return (
    <>
      <section className="bg-deep text-white [--ink:#f4f1e8] [--ink-soft:#a9b4c8] [--line:rgba(255,255,255,0.2)] [--blue:#f7b733] [--card-bg:#0e2545]">
        <div className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading title={t("heading")} />

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {VIDEO_TESTIMONIALS.map((v, i) => (
            <VideoCard key={`${v.context}-${v.videoId ?? i}`} context={v.context} videoId={v.videoId} />
          ))}
        </div>
        </div>
      </section>

      {/* Sección propia de Campamento: nunca mezclada con Campus (spec_00_testimonios-landing.md).
          Implementada como bloque del mismo landing, no ruta propia — confirmar con el usuario. */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <SectionHeading title={t("campHeading")} />

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CAMPAMENTO_VIDEO_IDS.map((videoId) => (
            <VideoCard key={videoId} context={t("camp")} videoId={videoId} />
          ))}
        </div>
      </section>

      {textTestimonials.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <SectionHeading title={t("byCourse")} />
          <div className="mt-6 rounded-xl border border-line bg-card-bg p-6">
            <TestimonialSlider items={textTestimonials} />
          </div>
        </section>
      )}
    </>
  );
}
