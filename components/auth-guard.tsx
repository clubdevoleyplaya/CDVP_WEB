"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoState } from "@/context/demo-state";
import { buttonVariants } from "@/components/ui/button";
import { loginHref } from "@/lib/safe-redirect";

type AuthGuardProps = {
  role?: "admin";
  children: React.ReactNode;
};

export function AuthGuard({ role, children }: AuthGuardProps) {
  const { session, me } = useDemoState();
  const pathname = usePathname();

  if (!session || (role && me?.role !== role)) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm text-ink-soft">
          {role === "admin"
            ? "Necesitás una cuenta de administrador para ver esto."
            : "Iniciá sesión para ver esto."}
        </p>
        <Link
          href={loginHref(pathname)}
          className={buttonVariants({ className: "mt-6 font-display text-xs font-bold uppercase tracking-wide" })}
        >
          Iniciar sesión
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
