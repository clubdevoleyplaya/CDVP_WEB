"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiErrorMessage } from "@/lib/use-api-error";

// Reemplaza a la caja de compra en los productos que se venden por cohorte.
export function WaitlistForm({ slug }: { slug: string }) {
  const t = useTranslations("Waitlist");
  const locale = useLocale();
  const apiError = useApiErrorMessage();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${slug}/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(apiError(res.status, body, t("error")));
        return;
      }
      setDone(true);
    } catch {
      setError(t("error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide">{t("title")}</h2>
      {done ? (
        <p role="status" className="text-sm font-bold text-green">
          {t("done")}
        </p>
      ) : (
        <>
          <p className="text-sm text-ink-soft">{t("text")}</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              aria-label={t("email")}
            />
            <Button
              type="submit"
              disabled={sending}
              className="w-fit font-display text-xs font-bold uppercase tracking-wide"
            >
              {sending ? t("submitting") : t("submit")}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
        </>
      )}
    </div>
  );
}
