"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { LOCALES, LOCALE_COOKIE, isLocale } from "@/lib/locale";

const NAMES: Record<(typeof LOCALES)[number], string> = { es: "ES", en: "EN", pt: "PT" };

export function LanguageSelector() {
  const t = useTranslations("LanguageSelector");
  const locale = useLocale();
  const router = useRouter();

  function change(value: string) {
    if (!isLocale(value)) return;
    document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <select
      aria-label={t("label")}
      value={locale}
      onChange={(e) => change(e.target.value)}
      className="rounded-lg border border-ink/20 bg-bg px-2 py-1.5 font-display text-xs font-bold uppercase tracking-wide"
    >
      {LOCALES.map((code) => (
        <option key={code} value={code}>
          {NAMES[code]}
        </option>
      ))}
    </select>
  );
}
