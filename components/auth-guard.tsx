"use client";

import { useDemoState } from "@/context/demo-state";
import { Button } from "@/components/ui/button";

type AuthGuardProps = {
  role?: "admin";
  children: React.ReactNode;
};

export function AuthGuard({ role, children }: AuthGuardProps) {
  const { session, me, setLoginOpen } = useDemoState();

  if (!session || (role && me?.role !== role)) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm text-ink-soft">
          {role === "admin"
            ? "Necesitás una cuenta de administrador para ver esto."
            : "Iniciá sesión para ver esto."}
        </p>
        <Button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="mt-6 font-display text-xs font-bold uppercase tracking-wide"
        >
          Iniciar sesión
        </Button>
      </section>
    );
  }

  return <>{children}</>;
}
