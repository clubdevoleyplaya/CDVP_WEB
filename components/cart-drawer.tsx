"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { computeDisplayPrice, formatPrice, paymentProviderFor } from "@/lib/price";
import { useLocalizeProduct } from "@/lib/localize-product";
import { getProductBySlug } from "@/lib/products";
import { useApiErrorMessage } from "@/lib/use-api-error";

export function CartDrawer() {
  const t = useTranslations("Cart");
  const localize = useLocalizeProduct();
  const apiError = useApiErrorMessage();
  const te = useTranslations("Errors");
  const {
    cart,
    removeFromCart,
    currency,
    isSubscriber,
    discountPercent,
    eurPrices,
    cartOpen,
    setCartOpen,
    session,
    me,
  } = useDemoState();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [testPayment, setTestPayment] = useState(false);

  const lines = cart
    .map((item) => {
      const base = getProductBySlug(item.slug);
      if (!base) return null;
      const product = localize(base);
      const { now } = computeDisplayPrice(product, currency, isSubscriber, discountPercent, eurPrices);
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
          payment_provider: paymentProviderFor(currency),
          currency,
          promo_code: promoCode.trim() || undefined,
          test_payment: testPayment || undefined,
        }),
      });
      if (res.status === 400) {
        const body = await res.json().catch(() => null);
        setError(apiError(res.status, body, te("checkout")));
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      setError(
        data.payment_error ? te("paymentLink") : te("alreadyOwnedMany"),
      );
    } catch {
      setError(te("payStart"));
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
            aria-label={t("view")}
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
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>
            {t("description")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {lines.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              {t("empty")}
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
                      {t("quantity", { count: item.qty })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular text-sm font-semibold">
                      {formatPrice(lineTotal, currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.slug)}
                      aria-label={t("remove", { title: product.title })}
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
              <span className="text-sm text-muted-foreground">{t("total")}</span>
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
                placeholder={t("promoPlaceholder")}
                aria-label={t("promoLabel")}
              />
              {promoCode.trim() !== "" && (
                <p className="text-xs text-muted-foreground">
                  {t("promoNote")}
                </p>
              )}
            </div>
          )}
          {lines.length > 0 && me?.role === "admin" && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={testPayment}
                onChange={(e) => setTestPayment(e.target.checked)}
              />
              {t("testPayment")}
            </label>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            onClick={handleCheckout}
            disabled={lines.length === 0 || paying}
            className="font-display text-xs font-bold tracking-wide uppercase"
          >
            {paying ? t("redirecting") : t("pay")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
