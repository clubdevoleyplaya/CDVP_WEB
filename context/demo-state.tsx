"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";

export type Currency = "ARS" | "USD";

export type CartItem = { slug: string; qty: number };

type Me = {
  role: "user" | "admin";
  isSubscriber: boolean;
};

type DemoState = {
  session: Session | null;
  me: Me | null;
  isSubscriber: boolean;
  /** true cuando no hay sesión real: isSubscriber viene del toggle de demo, no de la DB. */
  isDemoOverride: boolean;
  toggleSubscriber: () => void;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [demoIsSubscriber, setDemoIsSubscriber] = useState(false);
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // `me` solo se lee cuando hay session (ver el cálculo de isSubscriber más abajo),
    // así que no hace falta resetearlo acá si session es null.
    if (!session) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMe(data ? { role: data.role, isSubscriber: data.is_subscriber } : null))
      .catch(() => setMe(null));
  }, [session]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setSession(null);
    setMe(null);
  }

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

  const isSubscriber = session ? (me?.isSubscriber ?? false) : demoIsSubscriber;

  return (
    <DemoStateContext.Provider
      value={{
        session,
        me,
        isSubscriber,
        isDemoOverride: !session,
        toggleSubscriber: () => setDemoIsSubscriber((v) => !v),
        signOut,
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
