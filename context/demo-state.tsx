"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";

export type Currency = "ARS" | "USD";

export type CartItem = { slug: string; qty: number };

type Me = {
  role: "user" | "admin";
  isSubscriber: boolean;
  nickname: string | null;
  team: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

type ProfileFields = {
  nickname?: string | null;
  team?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
};

type DemoState = {
  session: Session | null;
  me: Me | null;
  isSubscriber: boolean;
  signOut: () => Promise<void>;
  updateProfile: (fields: ProfileFields) => Promise<void>;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  cart: CartItem[];
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
};

function mapMe(data: {
  role: "user" | "admin";
  is_subscriber: boolean;
  nickname: string | null;
  team: string | null;
  bio: string | null;
  avatar_url: string | null;
}): Me {
  return {
    role: data.role,
    isSubscriber: data.is_subscriber,
    nickname: data.nickname,
    team: data.team,
    bio: data.bio,
    avatarUrl: data.avatar_url,
  };
}

async function fetchMe(accessToken: string): Promise<Me | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return mapMe(await res.json());
}

const DemoStateContext = createContext<DemoState | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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
    fetchMe(session.access_token).then(setMe).catch(() => setMe(null));
  }, [session]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setSession(null);
    setMe(null);
  }

  async function updateProfile(fields: ProfileFields) {
    if (!session) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: fields.nickname,
        team: fields.team,
        bio: fields.bio,
        avatar_url: fields.avatarUrl,
      }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el perfil");
    setMe(mapMe(await res.json()));
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

  const isSubscriber = session ? (me?.isSubscriber ?? false) : false;

  return (
    <DemoStateContext.Provider
      value={{
        session,
        me,
        isSubscriber,
        signOut,
        updateProfile,
        currency,
        setCurrency,
        cart,
        addToCart,
        removeFromCart,
        cartOpen,
        setCartOpen,
        loginOpen,
        setLoginOpen,
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
