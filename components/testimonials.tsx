// Testimonios en texto: ver spec_00_testimonios-landing.md (CDVP_WEB). Se
// reasignaron por curso asincrónico y viven en `lib/products.ts` (campo
// `testimonials` de cada producto), no acá — se muestran en /producto/[slug].
//
// Dos citas quedan sin asignar (ninguna nombra un curso identificable):
// "Gracias Juli por explicar fácil..." (Diego Huicy) y "Desde Side Out
// Volleyball Club en Venezuela recomendamos este curso..." (Lenhil Linares).
// Pendiente que Juli confirme a qué curso corresponden — no se inventa. Ver
// TODO.md, Fase 3.
//
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
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface">
      {videoId ? (
        <div className="aspect-[9/16] w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
            title={`Testimonio — ${context}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-[9/16] w-full items-center justify-center bg-line font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
          Video próximamente
        </div>
      )}
      <figcaption className="p-3 font-display text-xs font-bold uppercase tracking-wide text-blue">
        {context}
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-2xl font-bold uppercase">Lo que dicen los alumnos</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {VIDEO_TESTIMONIALS.map((v, i) => (
            <VideoCard key={`${v.context}-${v.videoId ?? i}`} context={v.context} videoId={v.videoId} />
          ))}
        </div>
      </section>

      {/* Sección propia de Campamento: nunca mezclada con Campus (spec_00_testimonios-landing.md).
          Implementada como bloque del mismo landing, no ruta propia — confirmar con el usuario. */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="font-display text-2xl font-bold uppercase">Campamento de entrenamiento</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CAMPAMENTO_VIDEO_IDS.map((videoId) => (
            <VideoCard key={videoId} context="Campamento" videoId={videoId} />
          ))}
        </div>
      </section>
    </>
  );
}
