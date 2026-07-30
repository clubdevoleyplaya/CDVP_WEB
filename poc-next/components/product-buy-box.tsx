"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useDemoState } from "@/context/demo-state";
import { computeDisplayPrice, formatPrice } from "@/lib/price";
import type { Product } from "@/lib/products";

export function ProductBuyBox({ product }: { product: Product }) {
  const { currency, isSubscriber, addToCart } = useDemoState();
  const { now, old, showOld } = computeDisplayPrice(product, currency, isSubscriber);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paid, setPaid] = useState(false);

  const rail =
    currency === "USD"
      ? "Pago internacional vía Paddle (Merchant of Record)"
      : "Pago en Argentina vía MercadoPago";

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-line bg-surface p-6">
      <div className="flex items-baseline gap-2">
        {showOld && (
          <span className="tabular text-base text-ink-soft line-through">
            {formatPrice(old, currency)}
          </span>
        )}
        <span className="tabular text-3xl font-black text-yellow">{formatPrice(now, currency)}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCheckoutOpen((v) => !v);
            setPaid(false);
          }}
          className="w-fit rounded-sm bg-ink px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-bg transition-colors hover:bg-blue"
        >
          {checkoutOpen ? "Cerrar" : "Comprar"}
        </button>
        <button
          type="button"
          onClick={() => addToCart(product.slug)}
          className="flex w-fit items-center gap-2 rounded-sm border border-line px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:border-blue hover:text-blue"
        >
          <ShoppingBag className="size-4" />
          Agregar al carrito
        </button>
      </div>

      <AnimatePresence initial={false}>
        {checkoutOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 rounded-sm border border-line bg-bg p-4">
              <p className="font-display text-xs font-bold uppercase tracking-wide text-blue">
                {rail}
              </p>
              <p className="text-sm text-ink-soft">
                Demo — no se procesa ningún pago real.
              </p>
              {paid ? (
                <p className="w-fit rounded-sm bg-green/20 px-3 py-1.5 font-display text-sm font-bold">
                  ✅ Pago simulado — bienvenido a bordo
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setPaid(true)}
                  className="w-fit rounded-sm bg-blue px-5 py-2 font-display text-xs font-bold uppercase tracking-wide text-white"
                >
                  Simular pago
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
