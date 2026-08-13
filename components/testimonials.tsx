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
// videoId es null hasta que Juli suba los clips reales a YouTube (hoy viven
// como archivos sueltos en Drive). Sin id real, se muestra un placeholder en
// vez de un iframe roto. Los testimonios de Campamento de entrenamiento NO
// van acá: por spec deben verse solo en su propia sección, que todavía no
// existe en el sitio (pendiente definir con el usuario si es un bloque
// separado o una ruta propia).
const VIDEO_TESTIMONIALS: { context: string; videoId: string | null }[] = [
  { context: "1:1 Beach Volley Lab", videoId: null },
  { context: "Campus", videoId: null },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="font-display text-2xl font-bold uppercase">Lo que dicen los alumnos</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VIDEO_TESTIMONIALS.map((v) => (
          <figure key={v.context} className="overflow-hidden rounded-xl border border-line bg-surface">
            {v.videoId ? (
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${v.videoId}?modestbranding=1&rel=0`}
                  title={`Testimonio — ${v.context}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-line font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
                Video próximamente
              </div>
            )}
            <figcaption className="p-3 font-display text-xs font-bold uppercase tracking-wide text-blue">
              {v.context}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
