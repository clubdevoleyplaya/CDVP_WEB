"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { DEFAULT_DISCOUNT_PERCENT, type DiscountPercent } from "@/lib/price";
import { sessionIsDead } from "@/lib/session-check";
import { createClient } from "@/lib/supabase/client";

import { CURRENCY_COOKIE, type Currency } from "@/lib/locale";

export type { Currency };

export type CartItem = { slug: string; qty: number };

type Me = {
  role: "user" | "admin";
  isSubscriber: boolean;
  subscriptionStatus: string | null;
  nickname: string | null;
  team: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
};

type ProfileFields = {
  nickname?: string | null;
  team?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

type DemoState = {
  session: Session | null;
  me: Me | null;
  isSubscriber: boolean;
  discountPercent: DiscountPercent;
  signOut: () => Promise<void>;
  updateProfile: (fields: ProfileFields) => Promise<void>;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  cart: CartItem[];
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cancelSubscription: () => Promise<void>;
};

function mapMe(data: {
  role: "user" | "admin";
  is_subscriber: boolean;
  subscription_status: string | null;
  nickname: string | null;
  team: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
}): Me {
  return {
    role: data.role,
    isSubscriber: data.is_subscriber,
    subscriptionStatus: data.subscription_status,
    nickname: data.nickname,
    team: data.team,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    bannerUrl: data.banner_url,
  };
}

class SessionRejected extends Error {}

async function fetchMe(accessToken: string): Promise<Me | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) throw new SessionRejected();
  if (!res.ok) return null;
  return mapMe(await res.json());
}

async function fetchDiscountPercent(): Promise<DiscountPercent | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/descuentos`);
  if (!res.ok) return null;
  const data = await res.json();
  return { ...DEFAULT_DISCOUNT_PERCENT, ...data.descuentos };
}

const DemoStateContext = createContext<DemoState | null>(null);

export function DemoStateProvider({
  children,
  initialCurrency = "ARS",
}: {
  children: ReactNode;
  initialCurrency?: Currency;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [discountPercent, setDiscountPercent] = useState<DiscountPercent>(DEFAULT_DISCOUNT_PERCENT);
  const [me, setMe] = useState<Me | null>(null);
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);
  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    // La elección queda en una cookie: gana a la divisa detectada en las próximas visitas.
    document.cookie = `${CURRENCY_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax${
      location.protocol === "https:" ? "; secure" : ""
    }`;
  };
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
    // Públicos (también para visitantes): si falla, quedan los valores iniciales.
    fetchDiscountPercent()
      .then((rules) => rules && setDiscountPercent(rules))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // `me` solo se lee cuando hay session (ver el cálculo de isSubscriber más abajo),
    // así que no hace falta resetearlo acá si session es null.
    if (!session) return;
    fetchMe(session.access_token)
      .then(setMe)
      .catch(async (error) => {
        setMe(null);
        if (!(error instanceof SessionRejected)) return;
        // La API rechazó el token: si la cuenta ya no existe (o la sesión murió), se cierra la
        // sesión local para no quedar "logueado" viendo errores. `scope: local` porque en el
        // servidor ya no hay nada que revocar.
        const supabase = createClient();
        if (await sessionIsDead(() => supabase.auth.getUser())) {
          await supabase.auth.signOut({ scope: "local" });
          setSession(null);
        }
      });
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
        banner_url: fields.bannerUrl,
      }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el perfil");
    setMe(mapMe(await res.json()));
  }

  async function cancelSubscription() {
    if (!session) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/suscripcion/cancelar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) throw new Error("No se pudo cancelar la suscripción");
    const me = await fetchMe(session.access_token);
    setMe(me);
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
        discountPercent,
        signOut,
        updateProfile,
        cancelSubscription,
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
