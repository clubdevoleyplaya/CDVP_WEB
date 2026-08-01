"use client";

import { useDemoState } from "@/context/demo-state";

export function WelcomePack() {
  const { isSubscriber, session, setLoginOpen } = useDemoState();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-8">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-blue">
        Beneficio de suscripción
      </p>
      <h2 className="font-display text-2xl font-bold uppercase">Welcome Pack</h2>
      <p className="max-w-[60ch] text-sm text-ink-soft">
        Acceso completo al pack de bienvenida como parte de tu suscripción mensual.
      </p>
      {isSubscriber ? (
        <span className="w-fit rounded-lg bg-green/20 px-3 py-1 font-display text-sm font-bold">
          ✅ Desbloqueado — bienvenido al club
        </span>
      ) : session ? (
        <span className="w-fit rounded-lg bg-blue/10 px-3 py-1 font-display text-sm font-bold text-blue">
          🔒 Bloqueado — sumate a la suscripción para ver el contenido
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="w-fit rounded-lg bg-blue/10 px-3 py-1 font-display text-sm font-bold text-blue"
        >
          🔒 Bloqueado — iniciá sesión para ver el contenido
        </button>
      )}
    </div>
  );
}
