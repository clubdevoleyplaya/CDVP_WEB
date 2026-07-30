import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-6 py-10 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-wide">
        Club de Voley Playa — Juli Azaad
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs text-ink-soft">
        PoC de arquitectura y contenido — migrado desde clubdevoleyplaya.com (Wisboo). Precios en
        USD son ilustrativos; el tipo de cambio real se define con Paddle. Sin conexión pagos ni
        backend real.
      </p>
      <Link
        href="/admin/analytics"
        className="mt-4 inline-block text-xs text-ink-soft/70 underline-offset-2 hover:text-blue hover:underline"
      >
        Panel admin (demo)
      </Link>
    </footer>
  );
}
