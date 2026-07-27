"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "ARS" | "USD";

type DemoState = {
  isSubscriber: boolean;
  toggleSubscriber: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const DemoStateContext = createContext<DemoState | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [currency, setCurrency] = useState<Currency>("ARS");

  return (
    <DemoStateContext.Provider
      value={{
        isSubscriber,
        toggleSubscriber: () => setIsSubscriber((v) => !v),
        currency,
        setCurrency,
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
