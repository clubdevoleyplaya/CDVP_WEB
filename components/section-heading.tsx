import type { ReactNode } from "react";

// Encabezado de sección: etiqueta en mayúsculas + título grande + subtítulo opcional.
export function SectionHeading({
  kicker,
  title,
  subtitle,
  as: Tag = "h2",
  className = "",
}: {
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={className}>
      {kicker && (
        <p className="font-display text-base font-bold uppercase tracking-wider text-blue">{kicker}</p>
      )}
      <Tag className="mt-1 font-display text-4xl font-bold uppercase leading-none">{title}</Tag>
      {subtitle && <p className="mt-3 max-w-[65ch] text-lg text-ink-soft">{subtitle}</p>}
    </div>
  );
}
