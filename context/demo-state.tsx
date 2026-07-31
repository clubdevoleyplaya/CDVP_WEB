"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "ARS" | "USD";

export type CartItem = { slug: string; qty: number };

type DemoState = {
  isSubscriber: boolean;
  toggleSubscriber: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  cart: CartItem[];
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const DemoStateContext = createContext<DemoState | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  function addToCart(slug: string) {
    setCart((items) => {
      const existing = items.find((i) => i.slug === slug);
      if (existing) {
        return items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...items, { slug, qty: 1 }];
    });
    setCartOpen(true);
  }

  function removeFromCart(slug: string) {
    setCart((items) => items.filter((i) => i.slug !== slug));
  }

  return (
    <DemoStateContext.Provider
      value={{
        isSubscriber,
        toggleSubscriber: () => setIsSubscriber((v) => !v),
        currency,
        setCurrency,
        cart,
        addToCart,
        removeFromCart,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState() {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}
