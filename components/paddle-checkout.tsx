"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

type PaddleGlobal = {
  Environment: { set: (env: "sandbox") => void };
  Initialize: (options: { token: string }) => void;
  Checkout: { open: (options: { transactionId: string; settings?: { locale?: string } }) => void };
};

declare global {
  interface Window {
    Paddle?: PaddleGlobal;
  }
}

const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

export function PaddleCheckout() {
  const t = useTranslations("Pay");
  const locale = useLocale();
  const transactionId = useSearchParams().get("_ptxn");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !transactionId || !CLIENT_TOKEN || !window.Paddle) return;
    if (CLIENT_TOKEN.startsWith("test_")) window.Paddle.Environment.set("sandbox");
    window.Paddle.Initialize({ token: CLIENT_TOKEN });
    window.Paddle.Checkout.open({ transactionId, settings: { locale } });
  }, [loaded, transactionId, locale]);

  if (!CLIENT_TOKEN) {
    return (
      <p className="mt-4 text-sm text-ink-soft">
        {t("unavailable")}
      </p>
    );
  }

  if (!transactionId) {
    return (
      <p className="mt-4 text-sm text-ink-soft">
        {t("notFound")}
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
      <p className="mt-4 text-sm text-ink-soft">{t("opening")}</p>
    </>
  );
}
