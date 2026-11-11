"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice, formatPrice, paymentProviderFor } from "@/lib/price";
import type { Product } from "@/lib/products";
import { loginHref } from "@/lib/safe-redirect";
import { useOwnedProduct } from "@/lib/use-owned-product";

export function ProductBuyBox({ product }: { product: Product }) {
  const t = useTranslations("BuyBox");
  const te = useTranslations("Errors");
  const { currency, isSubscriber, discountPercent, eurPrices, addToCart, session } = useDemoState();
  const router = useRouter();
  const { now, old, showOld } = computeDisplayPrice(product, currency, isSubscriber, discountPercent, eurPrices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const owned = useOwnedProduct(product.slug);
  const isCourse = product.category === "curso";

  const rail =
    currency === "ARS"
      ? t("railArs")
      : t("railIntl");

  async function handleBuy() {
    if (!session) {
      router.push(loginHref(`/producto/${product.slug}`));
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
          payment_provider: paymentProviderFor(currency),
          currency,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      if (data.payment_error) {
        setError(te("paymentLink"));
        return;
      }
      setError(te("alreadyOwned"));
    } catch {
      setError(te("buyStart"));
    } finally {
      setLoading(false);
    }
  }

  // Con sesión y sin respuesta aún se muestra una carga (no la ficha de compra, que parpadearía).
  if (session && owned === null) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6" aria-busy="true">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  if (owned) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-green">
          {isCourse ? t("ownedCourse") : t("ownedProduct")}
        </p>
        <Link
          href={isCourse ? `/curso/${product.slug}` : "/perfil"}
          className="w-fit rounded-lg bg-ink px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-bg transition-colors hover:bg-blue"
        >
          {isCourse ? t("goCourse") : t("goProfile")}
        </Link>
      </div>
    );
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
          {loading ? t("redirecting") : session ? t("buy") : t("loginToBuy")}
        </button>
        <button
          type="button"
          onClick={() => addToCart(product.slug)}
          className="flex w-fit items-center gap-2 rounded-lg border border-line px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:border-blue hover:text-blue"
        >
          <ShoppingBag className="size-4" />
          {t("addToCart")}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
