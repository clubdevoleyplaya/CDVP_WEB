export default function PrivacidadPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">Política de privacidad</h1>
      <p className="mt-2 text-xs text-ink-soft">
        Borrador — pendiente de revisión legal antes de un lanzamiento formal.
      </p>

      <div className="mt-8 space-y-8 text-sm text-ink-soft">
        <div>
          <h2 className="font-display text-base font-bold uppercase text-ink">
            Qué datos guardamos
          </h2>
          <p className="mt-2">
            Cuando creás una cuenta guardamos tu nombre y tu mail. Cuando comprás un curso o
            combo, guardamos qué compraste y cuándo, para poder darte acceso a ese contenido. No
            guardamos datos de tu tarjeta ni de tu método de pago — eso lo procesa directamente
            Mercado Pago.
          </p>
        </div>

        <div>
          <h2 className="font-display text-base font-bold uppercase text-ink">
            Con quién compartimos datos
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-ink">Supabase:</strong> guarda tu cuenta y tus datos de
              acceso (autenticación y base de datos).
            </li>
            <li>
              <strong className="text-ink">Mercado Pago:</strong> procesa el pago cuando comprás
              un curso o combo.
            </li>
            <li>
              <strong className="text-ink">YouTube:</strong> los videos del sitio están embebidos
              desde YouTube — al reproducirlos, YouTube puede registrar tu IP según sus propias
              políticas.
            </li>
          </ul>
          <p className="mt-2">No usamos inteligencia artificial en ninguna parte del sitio.</p>
        </div>

        <div>
          <h2 className="font-display text-base font-bold uppercase text-ink">
            Pedir que borremos tus datos
          </h2>
          <p className="mt-2">
            Si querés dar de baja tu cuenta o que borremos tus datos, escribinos a{" "}
            <span className="font-bold text-ink">[mail de contacto — completar]</span> desde el
            mismo mail con el que te registraste.
          </p>
        </div>
      </div>
    </section>
  );
}
