"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageSelector } from "@/components/language-selector";
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
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b border-line bg-bg/90 px-6 py-3 backdrop-blur">
      <NavDrawer />
      <Link href="/" className="flex items-center gap-2">
        <Image src="/brand/ball.png" alt="" width={32} height={32} className="h-8 w-8" />
        <span className="font-display text-lg font-bold uppercase tracking-wide">
          Club de Voley Playa
        </span>
      </Link>
      <nav className="ml-4 hidden flex-wrap gap-5 md:flex">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="font-display text-xs font-bold uppercase tracking-wide hover:text-blue"
          >
            {tm(item.key)}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
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
              className="hidden rounded-lg border border-blue bg-blue px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-white md:inline-flex"
            >
              {t("signup")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
