"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(t("errors.forgotPassword"));
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <section className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-2xl font-bold uppercase">{t("forgot.checkTitle")}</h1>
        <p className="mt-4 text-sm">
          {t.rich("forgot.checkBody", { email, ...{ b: (chunks) => <strong>{chunks}</strong> } })}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">{t("forgot.title")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t("forgot.intro")}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 font-display text-xs font-bold uppercase tracking-wide"
        >
          {loading ? t("forgot.submitting") : t("forgot.submit")}
        </Button>
      </form>

      <p className="mt-6 text-sm">
        <Link href="/login" className="font-bold text-blue underline">
          {t("forgot.back")}
        </Link>
      </p>
    </section>
  );
}
