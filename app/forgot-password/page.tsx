"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
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
      setError(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <section className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-2xl font-bold uppercase">Revisá tu email</h1>
        <p className="mt-4 text-sm">
          Si <strong>{email}</strong> tiene una cuenta, te mandamos un link para elegir una
          nueva contraseña.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">Olvidé mi contraseña</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Ingresá tu email y te mandamos un link para elegir una nueva contraseña.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
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
          {loading ? "Enviando…" : "Enviar link"}
        </Button>
      </form>

      <p className="mt-6 text-sm">
        <Link href="/login" className="font-bold text-blue underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </section>
  );
}
