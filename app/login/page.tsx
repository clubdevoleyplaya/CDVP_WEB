"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";

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
    router.push(searchParams.get("next") ?? "/");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">Iniciar sesión</h1>

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
