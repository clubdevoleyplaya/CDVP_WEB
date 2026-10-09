"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";
import { safeNextPath } from "@/lib/safe-redirect";
import { USER_MESSAGES } from "@/lib/user-errors";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSuccess() {
    router.push(safeNextPath(searchParams.get("next")));
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">Iniciar sesión</h1>

      {searchParams.get("error") && (
        // Cualquier valor de `error` muestra el mismo texto fijo: el parámetro no se refleja.
        <p role="alert" className="mt-4 text-sm text-red-600">
          {USER_MESSAGES.invalidLink}
        </p>
      )}

      <LoginForm onSuccess={handleSuccess} className="mt-8" />

      <p className="mt-6 text-sm">
        ¿No tenés cuenta?{" "}
        <Link href="/signup" className="font-bold text-blue underline">
          Registrate
        </Link>
      </p>
    </section>
  );
}
