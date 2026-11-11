"use client";

import { AuthGuard } from "@/components/auth-guard";
import { WaitlistAdmin } from "@/components/waitlist-admin";

export default function AdminListaEsperaPage() {
  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Lista de espera</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Personas que quieren el Curso de Entrenadores. Avísales cuando abra la próxima cohorte.
        </p>
        <div className="mt-8">
          <WaitlistAdmin />
        </div>
      </section>
    </AuthGuard>
  );
}
