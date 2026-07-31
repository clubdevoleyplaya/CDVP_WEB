"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
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
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
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
          Te mandamos un link de confirmación a <strong>{email}</strong>. Hacé clic ahí para
          activar tu cuenta.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">Registrate</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nombre
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-lg border border-line bg-bg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-line bg-bg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-line bg-bg px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg border border-blue bg-blue px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50"
        >
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-bold text-blue underline">
          Iniciar sesión
        </Link>
      </p>
    </section>
  );
}
