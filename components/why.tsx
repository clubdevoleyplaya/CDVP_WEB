export function Why() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-blue">
        ¿Por qué hago esto?
      </p>
      <div className="mt-3 grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <blockquote className="border-l-[3px] border-blue pl-5 text-2xl italic leading-snug">
          &ldquo;Los trofeos hay que guardarlos en una caja: el mejor premio es lo que aprendemos, y
          eso en algún momento hay que transmitirlo.&rdquo;
          <footer className="mt-3 font-display text-xs font-normal not-italic uppercase tracking-wide text-ink-soft">
            — un entrenador de Juli
          </footer>
        </blockquote>
        <p className="max-w-[85ch] text-base leading-relaxed">
          Hace años que Juli le da vueltas a esta idea: un espacio virtual donde cualquiera pueda
          aprender voley playa — técnica, físico y cabeza — desde lo más básico hasta los detalles
          que solo se aprenden compitiendo. Hoy podés empezar a convertirte en un{" "}
          <strong>jugador profesional</strong>.
        </p>
      </div>
    </section>
  );
}
