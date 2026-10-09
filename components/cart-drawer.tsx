"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice, formatPrice } from "@/lib/price";
import { getProductBySlug } from "@/lib/products";
import { apiErrorMessage, USER_MESSAGES } from "@/lib/user-errors";

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    currency,
    isSubscriber,
    discountPercent,
    cartOpen,
    setCartOpen,
    session,
  } = useDemoState();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");

  const lines = cart
    .map((item) => {
      const product = getProductBySlug(item.slug);
      if (!product) return null;
      const { now } = computeDisplayPrice(product, currency, isSubscriber, discountPercent);
      return { item, product, lineTotal: now * item.qty };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = cart.reduce((n, i) => n + i.qty, 0);

  async function handleCheckout() {
    if (!session) {
      setCartOpen(false);
      router.push("/login");
      return;
    }
    setPaying(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((i) => ({ slug: i.slug, quantity: i.qty })),
          payment_provider: currency === "USD" ? "paddle" : "mercadopago",
          promo_code: promoCode.trim() || undefined,
        }),
      });
      if (res.status === 400) {
        const body = await res.json().catch(() => null);
        setError(apiErrorMessage(res.status, body, USER_MESSAGES.checkout));
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      setError(
        data.payment_error ? USER_MESSAGES.paymentLink : "Ya tenés estos productos — revisá tu perfil.",
      );
    } catch {
      setError("No se pudo iniciar el pago. Probá de nuevo.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen} swipeDirection="right">
      <DrawerTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative font-sans"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="size-4" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {itemCount}
              </Badge>
            )}
          </Button>
        }
      />
      <DrawerContent className="font-sans sm:max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Tu carrito</DrawerTitle>
          <DrawerDescription>
            Revisá tu compra antes de ir a pagar.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {lines.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              Todavía no agregaste nada al carrito.
            </p>
          ) : (
            <ul className="flex flex-col gap-3 py-2">
              {lines.map(({ item, product, lineTotal }) => (
                <li
                  key={item.slug}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0"
                >
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href={`/producto/${product.slug}`}
                      className="text-sm font-medium hover:text-blue"
                      onClick={() => setCartOpen(false)}
                    >
                      {product.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      Cantidad: {item.qty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular text-sm font-semibold">
                      {formatPrice(lineTotal, currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.slug)}
                      aria-label={`Quitar ${product.title} del carrito`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DrawerFooter>
          {lines.length > 0 && (
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="tabular text-lg font-bold">
                {formatPrice(total, currency)}
              </span>
            </div>
          )}
          {lines.length > 0 && (
            <div className="flex flex-col gap-1">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="¿Tienes un código?"
                aria-label="Código promocional"
              />
              {promoCode.trim() !== "" && (
                <p className="text-xs text-muted-foreground">
                  El descuento del código se calcula al pagar.
                </p>
              )}
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            onClick={handleCheckout}
            disabled={lines.length === 0 || paying}
            className="font-display text-xs font-bold tracking-wide uppercase"
          >
            {paying ? "Redirigiendo..." : "Ir a pagar"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
