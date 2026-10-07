"use client";

import { AuthGuard } from "@/components/auth-guard";
import { UnfulfilledPayments } from "@/components/unfulfilled-payments";

export default function AdminPagosPage() {
  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Pagos sin acceso</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Cobros que el proveedor de pago aprobó y que no le dieron acceso al cliente. Hay que
          revisarlos a mano: reembolsar en MercadoPago o Paddle, o entregar el acceso. Esta lista
          solo muestra, no cambia nada.
        </p>
        <div className="mt-8">
          <UnfulfilledPayments />
        </div>
      </section>
    </AuthGuard>
  );
}
