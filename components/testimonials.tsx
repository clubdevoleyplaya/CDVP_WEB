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

// IDs reales de YouTube Shorts, pasados por Juli el 2026-08-13 (todo el
// listado de campus/campamento). Formato vertical (9:16), no 16:9.
const CAMPUS_VIDEO_IDS = [
  "v9th5Lzw2pQ", // Phoenix 1
  "huRWjiSSjmw", // Phoenix 2
  "2oTx-qDcSSU", // Phoenix 3
  "o3zQd5TDKcw", // Santiago 1
  "d0KV5RivCmA", // Santiago 2
  "QcSAdZamVg0", // Santiago 3
  "xuLayMj_uQk", // Santiago 4
  "WzS3a2tjMc0", // Santiago 5
  "g_7HsWN-aP0", // Guanaqueros 1
  "xrW2SYuEjhs", // Guanaqueros 2
  "XAb927TuWpo", // Guanaqueros 3
];

const CAMPAMENTO_VIDEO_IDS = ["8GQGaKE-Fp0", "l_093rxXi54"];

// Campus: todos mezclados sin distinción de sede, es el bloque de mayor
// volumen y contenido general del club (spec_00_testimonios-landing.md).
const VIDEO_TESTIMONIALS: { context: string; videoId: string | null }[] = [
  { context: "1:1 Beach Volley Lab", videoId: null },
  ...CAMPUS_VIDEO_IDS.map((videoId) => ({ context: "Campus", videoId })),
];

function VideoCard({ context, videoId }: { context: string; videoId: string | null }) {
  const t = useTranslations("Testimonials");
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface">
      {videoId ? (
        <div className="aspect-[9/16] w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=0`}
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
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-4xl font-bold uppercase">{t("heading")}</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {VIDEO_TESTIMONIALS.map((v, i) => (
            <VideoCard key={`${v.context}-${v.videoId ?? i}`} context={v.context} videoId={v.videoId} />
          ))}
        </div>
      </section>

      {/* Sección propia de Campamento: nunca mezclada con Campus (spec_00_testimonios-landing.md).
          Implementada como bloque del mismo landing, no ruta propia — confirmar con el usuario. */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="font-display text-4xl font-bold uppercase">{t("campHeading")}</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CAMPAMENTO_VIDEO_IDS.map((videoId) => (
            <VideoCard key={videoId} context={t("camp")} videoId={videoId} />
          ))}
        </div>
      </section>

      {textTestimonials.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="font-display text-4xl font-bold uppercase">{t("byCourse")}</h2>
          <div className="mt-6 rounded-xl border border-line bg-surface p-6">
            <TestimonialSlider items={textTestimonials} />
          </div>
        </section>
      )}
    </>
  );
}
