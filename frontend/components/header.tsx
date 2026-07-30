import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavDrawer } from "@/components/nav-drawer";
import { CartDrawer } from "@/components/cart-drawer";
import { CATEGORY_ROUTE_LABELS } from "@/lib/products";

const NAV_ROUTES = ["cursos", "programas", "descargables", "combos"] as const;

export function Header() {
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
        <button
          type="button"
          className="hidden rounded-sm border border-ink px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide md:inline-flex"
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          className="hidden rounded-sm border border-blue bg-blue px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-white md:inline-flex"
        >
          Registrate
        </button>
      </div>
    </header>
  );
}
