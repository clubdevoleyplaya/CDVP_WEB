"use client";

import { useDemoState, Currency } from "@/context/demo-state";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "ARS", label: "🇦🇷 ARS" },
  { code: "USD", label: "🌎 USD" },
];

export function DemoBar() {
  const { isSubscriber, isDemoOverride, toggleSubscriber, currency, setCurrency } = useDemoState();

  return (
    <div className="flex flex-wrap items-center gap-5 bg-band px-6 py-3 text-sm text-white">
      <span className="font-display uppercase tracking-wide text-xs font-bold">
        Panel de demo
      </span>
      {isDemoOverride ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSubscriber}
            onChange={toggleSubscriber}
            className="h-4 w-4 accent-yellow"
          />
          Soy suscriptor activo (Welcome Pack + 50% OFF en cursos)
        </label>
      ) : (
        <span>
          {isSubscriber
            ? "Suscripción activa (Welcome Pack + 50% OFF en cursos)"
            : "Sin suscripción activa"}
        </span>
      )}
      <div className="ml-auto flex gap-1" role="group" aria-label="Elegí moneda">
        {CURRENCIES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            className={`rounded-lg border px-3 py-1 text-xs font-bold transition-colors ${
              currency === code
                ? "bg-blue border-blue text-white"
                : "border-white/60 text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
