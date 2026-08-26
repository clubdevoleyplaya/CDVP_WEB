"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { formatPrice } from "@/lib/price";

type Plan = { title: string; description: string; price_ars: number };

export default function SuscripcionPage() {
  const { session, isSubscriber, setLoginOpen } = useDemoState();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [planError, setPlanError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/suscripcion/plan`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setPlan)
      .catch(() => setPlanError(true));
  }, []);

  async function handleSubscribe() {
    if (!session) {
      setLoginOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/suscripcion/preapproval`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.detail ?? "No se pudo iniciar la suscripción. Probá de nuevo.");
        return;
      }
      const data = await res.json();
      window.location.href = data.init_point;
    } catch {
      setError("No se pudo iniciar la suscripción. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Suscribite</h1>

      {planError ? (
        <p className="mt-4 text-sm text-destructive">
          No se pudo cargar el detalle de la suscripción. Probá de nuevo más tarde.
        </p>
      ) : plan ? (
        <>
          <p className="mt-4 text-sm text-ink-soft">{plan.description}</p>
          <p className="mt-4 font-display text-3xl font-black text-yellow">
            {formatPrice(plan.price_ars, "ARS")}
            <span className="text-sm font-normal text-ink-soft"> / mes</span>
          </p>
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-8 w-40" />
        </div>
      )}

      {isSubscriber ? (
        <p className="mt-8 w-fit mx-auto rounded-lg bg-green/20 px-4 py-2 font-display text-sm font-bold">
          ✅ Ya estás suscripto — gracias por ser parte del club
        </p>
      ) : (
        <Button
          type="button"
          onClick={handleSubscribe}
          disabled={loading || !plan}
          className="mt-8 font-display text-sm font-bold uppercase tracking-wide"
        >
          {loading ? "Redirigiendo..." : session ? "Suscribirme" : "Iniciar sesión para suscribirme"}
        </Button>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </section>
  );
}
