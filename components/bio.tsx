export function Bio() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-start gap-8 px-6 py-16 sm:grid-cols-[150px_1fr]">
      <div
        aria-hidden
        className="flex h-[100px] w-[100px] items-center justify-center rounded-full border border-line bg-[repeating-linear-gradient(45deg,var(--surface)_0_6px,var(--line)_6px_7px)] sm:h-[150px] sm:w-[150px]"
      >
        <span className="font-display text-3xl font-black text-blue sm:text-4xl">JA</span>
      </div>
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-wide text-blue">
          ¿Quién soy?
        </p>
        <p className="mt-3 max-w-[65ch] text-base">
          A los 13 años jugué mi primer torneo de beach volley y no me quise ir más de la arena.
          Desde ese día mi carrera se dividió en dos: inviernos de indoor, veranos de playa.
        </p>
        <p className="mt-3 max-w-[65ch] text-base">
          &ldquo;Para el año 2011 llegó la propuesta más linda y esperada de mi carrera, empecé a
          formar parte de la <strong>selección argentina</strong>.&rdquo; Ahí empezaron a
          cumplirse los sueños del Juli niño.
        </p>
        <ul className="mt-4 flex flex-col gap-1">
          <li className="font-display text-sm uppercase tracking-wide before:content-['—_']">
            Profesor de Educación Física
          </li>
          <li className="font-display text-sm uppercase tracking-wide before:content-['—_']">
            Entrenador internacional FIVB nivel I
          </li>
        </ul>
      </div>
    </section>
  );
}
