"use client";

import { useDemoState } from "@/context/demo-state";

export function WelcomePack() {
  const { isSubscriber } = useDemoState();

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-line bg-surface p-8">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-blue">
        Beneficio de suscripción
      </p>
      <h2 className="font-display text-2xl font-bold uppercase">Welcome Pack</h2>
      <p className="max-w-[60ch] text-sm text-ink-soft">
        Acceso completo al pack de bienvenida mientras tu suscripción mensual esté activa. Si se
        vence o se cancela, el acceso se corta al instante.
      </p>
      {isSubscriber ? (
        <span className="w-fit rounded-sm bg-green/20 px-3 py-1 font-display text-sm font-bold">
          ✅ Desbloqueado — bienvenido al club
        </span>
      ) : (
        <span className="w-fit rounded-sm bg-blue/10 px-3 py-1 font-display text-sm font-bold text-blue">
          🔒 Bloqueado — activá &ldquo;Soy suscriptor&rdquo; arriba para ver el contenido
        </span>
      )}
    </div>
  );
}
