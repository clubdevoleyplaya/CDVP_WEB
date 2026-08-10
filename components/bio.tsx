import Image from "next/image";

export function Bio() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-start gap-8 px-6 py-16 sm:grid-cols-[150px_1fr]">
      <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full border border-line sm:h-[150px] sm:w-[150px]">
        <Image
          src="/images/juli/headshot.jpg"
          alt="Juli Azaad"
          fill
          sizes="150px"
          className="object-cover object-top"
        />
      </div>
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-wide text-blue">
          ¿Quién soy?
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
          <p className="max-w-[65ch] text-base">
            A los 13 años jugué mi primer torneo de beach volley y no me quise ir más de la arena.
            Desde ese día mi carrera se dividió en dos: inviernos de indoor, veranos de playa.
          </p>
          <figure className="w-full shrink-0 sm:w-48">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
              <Image
                src="/images/juli/primer-torneo.jpg"
                alt="Juli de chico en su primer torneo de voley playa"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1.5 text-xs text-ink-soft">Primer torneo, 13 años</figcaption>
          </figure>
        </div>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <p className="max-w-[65ch] text-base">
            &ldquo;Para el año 2011 llegó la propuesta más linda y esperada de mi carrera, empecé a
            formar parte de la <strong>selección argentina</strong>.&rdquo; Ahí empezaron a
            cumplirse los sueños del Juli niño.
          </p>
          <figure className="w-full shrink-0 sm:w-48">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
              <Image
                src="/images/juli/jjoo-tokio-2020.jpg"
                alt="Juli en la Villa Olímpica de Tokio 2020, representando a la selección argentina"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1.5 text-xs text-ink-soft">Tokio 2020 — Selección Argentina</figcaption>
          </figure>
        </div>
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
