"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoState } from "@/context/demo-state";
import { formatPrice } from "@/lib/price";
import { useApiErrorMessage } from "@/lib/use-api-error";

type Plan = { title: string; description: string; price_ars: number };

export default function SuscripcionPage() {
  const t = useTranslations("Subscription");
  const apiError = useApiErrorMessage();
  const { session, isSubscriber } = useDemoState();
  const router = useRouter();

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
      router.push("/login");
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
        setError(
          apiError(res.status, body, t("startError")),
        );
        return;
      }
      const data = await res.json();
      window.location.href = data.init_point;
    } catch {
      setError(t("startError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">{t("title")}</h1>

      {planError ? (
        <p className="mt-4 text-sm text-destructive">
          {t("planError")}
        </p>
      ) : plan ? (
        <>
          <p className="mt-4 text-sm text-ink-soft">{plan.description}</p>
          <p className="mt-4 font-display text-3xl font-black text-yellow">
            {formatPrice(plan.price_ars, "ARS")}
            <span className="text-sm font-normal text-ink-soft">{t("perMonth")}</span>
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
          {t("already")}
        </p>
      ) : (
        <Button
          type="button"
          onClick={handleSubscribe}
          disabled={loading || !plan}
          className="mt-8 font-display text-sm font-bold uppercase tracking-wide"
        >
          {loading ? t("redirecting") : session ? t("subscribe") : t("loginToSubscribe")}
        </Button>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </section>
  );
}
