"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DiscountRulesEditor } from "@/components/discount-rules-editor";

export default function AdminDescuentosPage() {
  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Descuentos de suscriptor</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Elegí cuánto descuento reciben los suscriptores en cada categoría. El cambio vale para las
          próximas compras; las que ya se hicieron conservan su precio.
        </p>
        <div className="mt-8">
          <DiscountRulesEditor />
        </div>
      </section>
    </AuthGuard>
  );
}
