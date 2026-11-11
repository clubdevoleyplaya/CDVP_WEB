import Link from "next/link";
import { getTranslations } from "next-intl/server";

const LINKS = [
  { href: "/pricing", key: "pricing" },
  { href: "/contacto", key: "contact" },
  { href: "/condicionesservicio", key: "terms" },
  { href: "/politicareembolso", key: "refund" },
  { href: "/privacidad", key: "privacy" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <footer className="mt-auto border-t border-line px-6 py-10 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-wide">
        {t("brand")}
      </p>
      <nav className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-bold uppercase tracking-wide text-ink-soft underline"
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
