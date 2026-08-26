"use client";

import { AuthGuard } from "@/components/auth-guard";
import { GoteoCapsuleEditor } from "@/components/goteo-capsule-editor";

export default function AdminGoteoPage() {
  return (
    <AuthGuard role="admin">
      <section className="w-full px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">Goteo de ejercicios</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Navegá las 12 cápsulas del banco de 120 ejercicios y editá qué ejercicios entran en cada una.
        </p>
        <div className="mt-8">
          <GoteoCapsuleEditor />
        </div>
      </section>
    </AuthGuard>
  );
}
