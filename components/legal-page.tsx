import type { ReactNode } from "react";

export type LegalSection = { title: string; body: ReactNode };

export function LegalPage({
  title,
  draftNote,
  sections,
}: {
  title: string;
  draftNote?: string;
  sections: LegalSection[];
}) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">{title}</h1>
      {draftNote && <p className="mt-2 text-xs text-ink-soft">{draftNote}</p>}
      <div className="mt-8 space-y-8 text-sm text-ink-soft">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-base font-bold uppercase text-ink">
              {section.title}
            </h2>
            <div className="mt-2 space-y-2">{section.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
