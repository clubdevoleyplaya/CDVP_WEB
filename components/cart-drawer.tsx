"use client";

import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice, formatPrice } from "@/lib/price";
import { getProductBySlug } from "@/lib/products";

export function CartDrawer() {
  const { cart, removeFromCart, currency, isSubscriber, cartOpen, setCartOpen } =
    useDemoState();

  const lines = cart
    .map((item) => {
      const product = getProductBySlug(item.slug);
      if (!product) return null;
      const { now } = computeDisplayPrice(product, currency, isSubscriber);
      return { item, product, lineTotal: now * item.qty };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = cart.reduce((n, i) => n + i.qty, 0);

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
            Demo — el resumen no procesa ningún pago real todavía.
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
          <Button
            type="button"
            disabled={lines.length === 0}
            className="font-display text-xs font-bold tracking-wide uppercase"
          >
            Ir a pagar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
