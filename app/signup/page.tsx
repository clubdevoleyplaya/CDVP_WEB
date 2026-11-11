"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, locale },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);
    if (error) {
      setError(t("errors.signup"));
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <section className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-2xl font-bold uppercase">{t("signup.checkTitle")}</h1>
        <p className="mt-4 text-sm">
          {t.rich("signup.checkBody", { email, ...{ b: (chunks) => <strong>{chunks}</strong> } })}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">{t("signup.title")}</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">{t("name")}</Label>
          <Input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 font-display text-xs font-bold uppercase tracking-wide"
        >
          {loading ? t("signup.submitting") : t("signup.submit")}
        </Button>
      </form>

      <p className="mt-6 text-sm">
        {t("signup.haveAccount")}{" "}
        <Link href="/login" className="font-bold text-blue underline">
          {t("signup.loginLink")}
        </Link>
      </p>
    </section>
  );
}
