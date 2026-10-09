"use client";

import { AuthGuard } from "@/components/auth-guard";
import { EurPricesEditor } from "@/components/eur-prices-editor";

export default function AdminPreciosEurPage() {
  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Precios en euros</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Propuesta calculada con el cambio del día a partir del precio en dólares. Corrige lo que
          haga falta y aprueba cada precio: solo lo aprobado se muestra y se cobra, y el euro se
          ofrece en la web cuando todo el catálogo está aprobado.
        </p>
        <div className="mt-8">
          <EurPricesEditor />
        </div>
      </section>
    </AuthGuard>
  );
}
