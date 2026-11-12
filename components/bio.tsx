import Image from "next/image";
import { useTranslations } from "next-intl";

export function Bio() {
  const t = useTranslations("Bio");
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-start gap-8 px-6 py-16 sm:grid-cols-[220px_1fr]">
      <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full border border-line sm:h-[220px] sm:w-[220px]">
        <Image
          src="/images/juli/headshot.jpg"
          alt={t("headshotAlt")}
          fill
          sizes="220px"
          className="object-cover object-top"
        />
      </div>
      <div>
        <p className="font-display text-base font-bold uppercase tracking-wider text-blue">
          {t("kicker")}
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
          <p className="max-w-[70ch] text-xl leading-relaxed">
            {t("p1")}
          </p>
          <figure className="w-full shrink-0 sm:w-72">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
              <Image
                src="/images/juli/primer-torneo.jpg"
                alt={t("firstTournamentAlt")}
                fill
                sizes="288px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1.5 text-sm text-ink-soft">{t("firstTournamentCaption")}</figcaption>
          </figure>
        </div>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <p className="max-w-[70ch] text-xl leading-relaxed">
            {t.rich("p2", { b: (chunks) => <strong>{chunks}</strong> })}
            <br />
            <br />
            {t.rich("p3", { b: (chunks) => <strong>{chunks}</strong> })}
          </p>
          <figure className="w-full shrink-0 sm:w-72">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
              <Image
                src="/images/juli/jjoo-tokio-2020.jpg"
                alt={t("tokyoAlt")}
                fill
                sizes="288px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1.5 text-sm text-ink-soft">{t("tokyoCaption")}</figcaption>
          </figure>
        </div>
        <ul className="mt-4 flex flex-col gap-1">
          <li className="font-display text-lg uppercase tracking-wide before:content-['—_']">
            {t("cred1")}
          </li>
          <li className="font-display text-lg uppercase tracking-wide before:content-['—_']">
            {t("cred2")}
          </li>
          <li className="font-display text-lg uppercase tracking-wide before:content-['—_']">
            {t("cred3")}
          </li>
          <li className="font-display text-lg uppercase tracking-wide before:content-['—_']">
            {t("cred4")}
          </li>
        </ul>
      </div>
    </section>
  );
}
