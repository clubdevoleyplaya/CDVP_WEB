import { useTranslations } from "next-intl";

export function Why() {
  const t = useTranslations("Why");
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-blue">
        {t("kicker")}
      </p>
      <div className="mt-3 grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <blockquote className="border-l-[3px] border-blue pl-5 text-2xl italic leading-snug">
          &ldquo;{t("quote")}&rdquo;
          <footer className="mt-3 font-display text-xs font-normal not-italic uppercase tracking-wide text-ink-soft">
            {t("quoteBy")}
          </footer>
        </blockquote>
        <p className="max-w-[85ch] text-base leading-relaxed">
          {t.rich("text", { b: (chunks) => <strong>{chunks}</strong> })}
        </p>
      </div>
    </section>
  );
}
