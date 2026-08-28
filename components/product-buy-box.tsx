"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice, formatPrice } from "@/lib/price";
import type { Product } from "@/lib/products";

export function ProductBuyBox({ product }: { product: Product }) {
  const { currency, isSubscriber, addToCart, session } = useDemoState();
  const router = useRouter();
  const { now, old, showOld } = computeDisplayPrice(product, currency, isSubscriber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rail =
    currency === "USD"
      ? "Pago internacional vía Paddle (Merchant of Record)"
      : "Pago en Argentina vía MercadoPago";

  async function handleBuy() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ slug: product.slug, quantity: 1 }],
          payment_provider: currency === "USD" ? "paddle" : "mercadopago",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      if (data.payment_error) {
        setError(data.payment_error);
        return;
      }
      setError("Ya tenés este producto — revisá tu perfil.");
    } catch {
      setError("No se pudo iniciar la compra. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
      <div className="flex items-baseline gap-2">
        {showOld && (
          <span className="tabular text-base text-ink-soft line-through">
            {formatPrice(old, currency)}
          </span>
        )}
        <span className="tabular text-3xl font-black text-yellow">{formatPrice(now, currency)}</span>
      </div>
      <p className="text-xs text-ink-soft">{rail}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleBuy}
          disabled={loading}
          className="w-fit rounded-lg bg-ink px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-bg transition-colors hover:bg-blue disabled:opacity-50"
        >
          {loading ? "Redirigiendo..." : session ? "Comprar" : "Iniciar sesión para comprar"}
        </button>
        <button
          type="button"
          onClick={() => addToCart(product.slug)}
          className="flex w-fit items-center gap-2 rounded-lg border border-line px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:border-blue hover:text-blue"
        >
          <ShoppingBag className="size-4" />
          Agregar al carrito
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
