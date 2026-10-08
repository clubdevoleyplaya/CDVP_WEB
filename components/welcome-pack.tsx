"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { useDemoState } from "@/context/demo-state";

const DISMISS_KEY = "cdvp.welcomePack.dismissed";

const DISMISS_EVENT = "cdvp:welcome-pack-dismissed";

// localStorage puede no existir o lanzar (ventana privada, datos bloqueados): la franja tiene que
// verse y poder cerrarse igual. Si el almacenamiento falla, el cierre vale solo en esta visita.
let closedInMemory = false;

function readDismissed(): boolean {
  if (closedInMemory) return true;
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function dismiss() {
  closedInMemory = true;
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // sin storage: queda solo en memoria
  }
  window.dispatchEvent(new Event(DISMISS_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DISMISS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const CHIP = "rounded-lg border border-line bg-surface px-3 py-1 font-display text-sm font-bold";

export function WelcomePack() {
  const { isSubscriber, session } = useDemoState();
  // El servidor siempre dibuja la franja (snapshot `false`); el cliente la oculta tras hidratar.
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => false);

  if (dismissed) return null;

  return (
    <aside aria-label="Pack de Bienvenida" className="border-b border-line bg-blue/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-2">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
          <span className="font-display text-xs font-bold uppercase tracking-wide text-blue">
            Beneficio de suscripción
          </span>
          <strong className="font-display uppercase">Pack de Bienvenida</strong>
          <span className="hidden text-ink-soft md:inline">
            Acceso completo al pack de bienvenida como parte de tu suscripción mensual.
          </span>
        </p>

        <div className="ml-auto flex items-center gap-3">
          {isSubscriber ? (
            <span className={CHIP}>✅ Desbloqueado — bienvenido al club</span>
          ) : session ? (
            <Link href="/suscripcion" className={`${CHIP} text-blue hover:underline`}>
              🔒 Bloqueado — sumate a la suscripción
            </Link>
          ) : (
            <Link href="/login" className={`${CHIP} text-blue hover:underline`}>
              🔒 Bloqueado — iniciá sesión para ver el contenido
            </Link>
          )}
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={dismiss}
            className="rounded-md px-2 py-1 text-ink-soft hover:bg-blue/10 hover:text-ink"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
