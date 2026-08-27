"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavDrawer } from "@/components/nav-drawer";
import { CartDrawer } from "@/components/cart-drawer";
import { CATEGORY_ROUTE_LABELS } from "@/lib/products";
import { useDemoState } from "@/context/demo-state";

const NAV_ROUTES = ["cursos", "descargables", "combos"] as const;

export function Header() {
  const { session, me } = useDemoState();
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
        {NAV_ROUTES.map((route) => (
          <Link
            key={route}
            href={`/catalogo/${route}`}
            className="font-display text-xs font-bold uppercase tracking-wide hover:text-blue"
          >
            {CATEGORY_ROUTE_LABELS[route]}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
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
              href="/login"
              className="hidden rounded-lg border border-ink px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide md:inline-flex"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/signup"
              className="hidden rounded-lg border border-blue bg-blue px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-white md:inline-flex"
            >
              Registrate
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
