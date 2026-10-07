"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

type PaddleGlobal = {
  Environment: { set: (env: "sandbox") => void };
  Initialize: (options: { token: string }) => void;
  Checkout: { open: (options: { transactionId: string }) => void };
};

declare global {
  interface Window {
    Paddle?: PaddleGlobal;
  }
}

const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

export function PaddleCheckout() {
  const transactionId = useSearchParams().get("_ptxn");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !transactionId || !CLIENT_TOKEN || !window.Paddle) return;
    if (CLIENT_TOKEN.startsWith("test_")) window.Paddle.Environment.set("sandbox");
    window.Paddle.Initialize({ token: CLIENT_TOKEN });
    window.Paddle.Checkout.open({ transactionId });
  }, [loaded, transactionId]);

  if (!CLIENT_TOKEN) {
    return (
      <p className="mt-4 text-sm text-ink-soft">
        El pago en dólares todavía no está disponible. Vuelve a intentarlo más tarde.
      </p>
    );
  }

  if (!transactionId) {
    return (
      <p className="mt-4 text-sm text-ink-soft">
        No encontramos tu compra. Vuelve al carrito y toca &ldquo;Ir a pagar&rdquo; de nuevo.
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
      <p className="mt-4 text-sm text-ink-soft">Abriendo el pago seguro de Paddle...</p>
    </>
  );
}
