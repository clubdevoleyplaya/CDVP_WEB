import Link from "next/link";

export default function SuscripcionPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Suscribite</h1>
      <p className="mt-4 text-sm text-ink-soft">
        La pasarela de pago todavía está en construcción. Muy pronto vas a poder
        suscribirte acá y conseguir el Pack de Bienvenida + 50% OFF en cursos.
      </p>
      <Link href="/" className="mt-6 inline-block font-bold text-blue underline">
        Volver al inicio
      </Link>
    </section>
  );
}
