"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { CONTACT } from "@/lib/menu";
import { getProductBySlug } from "@/lib/products";

function readStoredSlug(): string | null {
  try {
    return sessionStorage.getItem("cdvp_last_product");
  } catch {
    return null;
  }
}

// Mercado Pago vuelve con ?producto=; Paddle no, así que se usa el último producto que se tocó comprar.
function useBoughtSlug(): string | null {
  const fromUrl = useSearchParams().get("producto");
  const stored = useSyncExternalStore(
    () => () => {},
    readStoredSlug,
    () => null,
  );
  return fromUrl ?? stored;
}

export function PayThanks() {
  const t = useTranslations("PayThanks");
  const slug = useBoughtSlug();
  const message = slug ? getProductBySlug(slug)?.whatsappAfterPurchase : undefined;
  const whatsapp = CONTACT.whatsapp.replace(/\D/g, "");

  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">{t("title")}</h1>
      <p className="mt-4 text-sm text-ink-soft">{t("text")}</p>
      {message && (
        <>
          <p className="mt-6 text-sm text-ink-soft">{t("whatsappText")}</p>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`}
            className="mt-3 inline-block rounded-lg bg-blue px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:brightness-110"
          >
            {t("whatsapp")}
          </a>
        </>
      )}
      <div className="mt-8">
        <Link href="/perfil" className="font-bold text-blue underline underline-offset-2">
          {t("profile")}
        </Link>
      </div>
    </>
  );
}
