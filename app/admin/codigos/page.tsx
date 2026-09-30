"use client";

import { AuthGuard } from "@/components/auth-guard";
import { PromoCodesEditor } from "@/components/promo-codes-editor";

export default function AdminCodigosPage() {
  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Códigos promocionales</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Crea códigos para días promocionales. Elige cuánto descuentan, en qué categorías valen,
          hasta cuándo y cuántas veces se pueden usar. No se suman al descuento de suscriptor: en
          cada producto rige el mejor de los dos.
        </p>
        <div className="mt-8">
          <PromoCodesEditor />
        </div>
      </section>
    </AuthGuard>
  );
}
