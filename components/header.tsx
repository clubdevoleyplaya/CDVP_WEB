"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageSelector } from "@/components/language-selector";
import { CurrencySwitch } from "@/components/currency-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavDrawer } from "@/components/nav-drawer";
import { CartDrawer } from "@/components/cart-drawer";
import { useDemoState } from "@/context/demo-state";
import { MENU_ITEMS } from "@/lib/menu";
import { loginHref } from "@/lib/safe-redirect";


export function Header() {
  const t = useTranslations("Header");
  const tm = useTranslations("Menu");
  const { session, me } = useDemoState();
  const pathname = usePathname();
  const displayName = me?.nickname || session?.user.email;
  const initial = (displayName ?? "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex flex-nowrap items-center gap-2 border-b border-band-border bg-band px-4 py-1.5 text-band-ink [--ink:var(--band-ink)] [--ink-soft:var(--band-ink-soft)] [--line:var(--band-line)] [--blue:var(--band-accent)] [--background:color-mix(in_srgb,var(--band-ink)_8%,transparent)] [--foreground:var(--band-ink)] [--input:var(--band-line)] [--muted:color-mix(in_srgb,var(--band-ink)_14%,transparent)] [--accent:color-mix(in_srgb,var(--band-ink)_14%,transparent)] [--accent-foreground:var(--band-ink)] [--muted-foreground:var(--band-ink-soft)] sm:gap-4 sm:px-6 md:flex-wrap">
      <NavDrawer />
      <Link href="/" aria-label="Club de Voley Playa" className="flex shrink-0 items-center rounded-xl bg-navy px-1.5 py-0.5">
        <Image src="/brand/logo.webp" alt="Club de Voley Playa by Juli Azaad" width={1000} height={769} priority className="h-14 w-auto sm:h-16" />
      </Link>
      <nav className="ml-4 hidden flex-wrap gap-5 md:flex">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="font-display text-base font-bold uppercase tracking-wide hover:text-blue"
          >
            {tm(item.key)}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <CurrencySwitch className="hidden sm:flex" />
        <LanguageSelector />
        <ThemeToggle />
        <CartDrawer />
        {session ? (
          <Link
            href="/perfil"
            className="hidden items-center gap-2 rounded-lg border border-ink px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide md:inline-flex"
          >
            <Avatar size="sm">
              {me?.avatarUrl ? <AvatarImage src={me.avatarUrl} alt="" /> : null}
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            {displayName}
          </Link>
        ) : (
          <>
            <Link
              href={loginHref(pathname)}
              className="hidden rounded-lg border border-ink px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide md:inline-flex"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className="hidden rounded-lg bg-sun px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-navy md:inline-flex"
            >
              {t("signup")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
