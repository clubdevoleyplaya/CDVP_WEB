"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useDemoState, Currency } from "@/context/demo-state";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "ARS", label: "🇦🇷 ARS" },
  { code: "USD", label: "🌎 USD" },
  { code: "EUR", label: "🇪🇺 EUR" },
];

export function DemoBar() {
  const t = useTranslations("DemoBar");
  const { isSubscriber, discountPercent, currency, setCurrency, eurReady } = useDemoState();

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 bg-band px-4 py-2 text-sm text-white sm:px-6 sm:py-3">
      {isSubscriber ? (
        <span>
          {t("activeSub", { percent: discountPercent.curso })}
        </span>
      ) : (
        <>
          <Badge
            render={<Link href="/suscripcion" />}
            className="border-yellow bg-yellow font-display text-xs font-bold uppercase tracking-wide text-white hover:opacity-90"
          >
            {t("noSub")}
          </Badge>
          <span>
            {t("subscribeCta", { percent: discountPercent.curso })}
          </span>
        </>
      )}
      <div className="ml-auto flex gap-1" role="group" aria-label={t("currencyLabel")}>
        {CURRENCIES.filter(({ code }) => code !== "EUR" || eurReady).map(({ code, label }) => (
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
