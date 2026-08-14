import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-6 py-10 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-wide">
        Club de Voley Playa — Juli Azaad
      </p>
      <Link
        href="/privacidad"
        className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-ink-soft underline"
      >
        Política de privacidad
      </Link>
    </footer>
  );
}
