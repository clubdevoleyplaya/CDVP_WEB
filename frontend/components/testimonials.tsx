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

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-display text-2xl font-bold uppercase">Lo que dicen los alumnos</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <blockquote
            key={t.author}
            className="rounded-sm border border-line bg-surface p-5 text-sm italic"
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
