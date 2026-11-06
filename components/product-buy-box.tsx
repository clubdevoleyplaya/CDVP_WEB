"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { CoursePreview } from "@/components/course-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { hasCourseAccess, type CourseAccess } from "@/lib/course-access";
import { computeDisplayPrice, formatPrice, paymentProviderFor } from "@/lib/price";
import type { Product } from "@/lib/products";
import { loginHref } from "@/lib/safe-redirect";
import { USER_MESSAGES } from "@/lib/user-errors";

export function ProductBuyBox({ product }: { product: Product }) {
  const { currency, isSubscriber, discountPercent, eurPrices, addToCart, session } = useDemoState();
  const router = useRouter();
  const { now, old, showOld } = computeDisplayPrice(product, currency, isSubscriber, discountPercent, eurPrices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // null = todavía no se sabe (con sesión); así no se ve la ficha de compra un instante antes de entrar al curso.
  const [ownedRaw, setOwned] = useState<boolean | null>(null);

  useEffect(() => {
    // /me/products trae el acceso a todas las categorías. Si la consulta falla, se muestra la caja
    // de compra y el checkout avisa igual ("Ya tenés este producto").
    if (!session) return;
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me/products`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((courses: CourseAccess[]) => !cancelled && setOwned(hasCourseAccess(courses, product.slug)))
      .catch(() => !cancelled && setOwned(false));
    return () => {
      cancelled = true;
    };
  }, [session, product.slug]);

  // Sin sesión no hay nada que consultar: no tiene el producto.
  const owned = session ? ownedRaw : false;
  const isCourse = product.category === "curso";
  const goesToClassroom = owned === true && !!session && isCourse;
  useEffect(() => {
    if (goesToClassroom) router.replace(`/curso/${product.slug}`);
  }, [goesToClassroom, router, product.slug]);

  const rail =
    currency === "ARS"
      ? "Pago en Argentina vía MercadoPago"
      : "Pago internacional vía Paddle (Merchant of Record)";

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
        setError(USER_MESSAGES.paymentLink);
        return;
      }
      setError("Ya tenés este producto — revisá tu perfil.");
    } catch {
      setError("No se pudo iniciar la compra. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // Con sesión y sin respuesta aún, o ya con el curso, se muestra una carga (no la ficha de compra).
  if (session && (owned === null || goesToClassroom)) {
    return (
      <div className="flex max-w-sm flex-col gap-3 rounded-xl border border-line bg-surface p-6" aria-busy="true">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
        {goesToClassroom && <p className="text-xs text-ink-soft">Abriendo tu curso...</p>}
      </div>
    );
  }

  // Sin sesión (o al cerrarla) `owned` puede venir de una consulta anterior: no se confía en él.
  if (owned && session) {
    return (
      <div className="flex max-w-sm flex-col gap-3 rounded-xl border border-line bg-surface p-6">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-green">Ya tenés este producto</p>
        <Link
          href="/perfil"
          className="w-fit rounded-lg bg-ink px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-bg transition-colors hover:bg-blue"
        >
          Ir a mi perfil
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="flex max-w-sm flex-col gap-3 rounded-xl border border-line bg-surface p-6">
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
    {isCourse && <CoursePreview product={product} />}
    </>
  );
}
