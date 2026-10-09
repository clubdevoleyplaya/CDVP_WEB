"use client";

import { AuthGuard } from "@/components/auth-guard";
import { SuspiciousAccesses } from "@/components/suspicious-accesses";

export default function AdminAccesosPage() {
  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Accesos sospechosos</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Cuentas con un uso raro del contenido de pago, para revisar a mano.
        </p>
        <div className="mt-8">
          <SuspiciousAccesses />
        </div>
      </section>
    </AuthGuard>
  );
}
