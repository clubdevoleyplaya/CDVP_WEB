"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";
import { CurrencySwitch } from "@/components/currency-switch";
import { useDemoState } from "@/context/demo-state";

export function DemoBar() {
  const t = useTranslations("DemoBar");
  const { isSubscriber, discountPercent } = useDemoState();

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 bg-deep px-4 py-2 text-sm text-white sm:px-6 sm:py-3">
      {isSubscriber ? (
        <span className="font-semibold">{t("activeSub", { percent: discountPercent.curso })}</span>
      ) : (
        <>
          <span className="font-semibold">{t("subscribeCta", { percent: discountPercent.curso })}</span>
          <Link
            href="/suscripcion"
            className="rounded-lg bg-sun px-4 py-1 font-display text-sm font-bold uppercase tracking-wide text-navy transition-colors hover:brightness-110"
          >
            {t("subscribeButton")}
          </Link>
        </>
      )}
      <CurrencySwitch className="ml-auto sm:hidden" />
    </div>
  );
}
