"use client";

import { useTranslations } from "next-intl";
import { useDemoState, Currency } from "@/context/demo-state";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "ARS", label: "ARS" },
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
];

// Interruptor de moneda en píldora. Hereda los colores del contenedor (header o barra oscura).
export function CurrencySwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("DemoBar");
  const { currency, setCurrency, eurReady } = useDemoState();
  return (
    <div
      role="group"
      aria-label={t("currencyLabel")}
      className={`flex gap-0.5 rounded-full border border-band-line p-0.5 ${className}`}
    >
      {CURRENCIES.filter(({ code }) => code !== "EUR" || eurReady).map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code)}
          aria-pressed={currency === code}
          className={`rounded-full px-3 py-1 font-display text-xs font-bold tracking-wide transition-colors ${
            currency === code ? "bg-sun text-navy" : "text-band-ink-soft hover:text-band-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
