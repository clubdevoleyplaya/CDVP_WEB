import Link from "next/link";

const LINKS = [
  { href: "/pricing", label: "Precios" },
  { href: "/condicionesservicio", label: "Condiciones de servicio" },
  { href: "/politicareembolso", label: "Política de reembolso" },
  { href: "/privacidad", label: "Política de privacidad" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-6 py-10 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-wide">
        Club de Voley Playa — Juli Azaad
      </p>
      <nav className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-bold uppercase tracking-wide text-ink-soft underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
