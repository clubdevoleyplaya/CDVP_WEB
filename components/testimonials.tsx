const TESTIMONIALS = [
  {
    quote:
      "Este curso de ataque, al igual que el de recepción y armado, describe los movimientos desde un análisis minucioso y claro.",
    author: "Fernando Ariel Mezzera",
  },
  {
    quote:
      "Gracias Juli por explicar fácil lo que puede ser difícil de entender. Es una gran ayuda brindarnos tanta calidad de contenido.",
    author: "Diego Huicy",
  },
  {
    quote:
      "Desde Side Out Volleyball Club en Venezuela recomendamos este curso, muy práctico, dinámico y fluido.",
    author: "Lenhil Linares",
  },
  {
    quote:
      "Muy buen desglose de las formas de ataque, entrada, shot, la carrera de entrada y la forma de golpear el balón.",
    author: "Hugo Morgado",
  },
];

// videoId es null hasta que Juli suba los clips reales a YouTube (hoy viven como
// archivos sueltos en 3 carpetas de Drive: 1:1 Beach Volley Lab, campamento de
// entrenamiento y campus). Sin id real, se muestra un placeholder en vez de un
// iframe roto.
const VIDEO_TESTIMONIALS: { context: string; videoId: string | null }[] = [
  { context: "1:1 Beach Volley Lab", videoId: null },
  { context: "Campamento de entrenamiento", videoId: null },
  { context: "Campus", videoId: null },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="font-display text-2xl font-bold uppercase">Lo que dicen los alumnos</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <blockquote
            key={t.author}
            className="rounded-xl border border-line bg-surface p-5 text-sm italic"
          >
            &ldquo;{t.quote}&rdquo;
            <footer className="mt-3 font-display text-xs font-bold not-italic uppercase tracking-wide text-blue">
              {t.author} · ★5
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
