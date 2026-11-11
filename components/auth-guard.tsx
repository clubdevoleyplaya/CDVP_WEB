"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDemoState } from "@/context/demo-state";
import { buttonVariants } from "@/components/ui/button";
import { loginHref } from "@/lib/safe-redirect";

type AuthGuardProps = {
  role?: "admin";
  children: React.ReactNode;
};

export function AuthGuard({ role, children }: AuthGuardProps) {
  const t = useTranslations("AuthGuard");
  const { session, me } = useDemoState();
  const pathname = usePathname();

  if (!session || (role && me?.role !== role)) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm text-ink-soft">
          {role === "admin" ? t("needAdmin") : t("needLogin")}
        </p>
        <Link
          href={loginHref(pathname)}
          className={buttonVariants({ className: "mt-6 font-display text-xs font-bold uppercase tracking-wide" })}
        >
          {t("login")}
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
