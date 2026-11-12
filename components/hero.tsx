"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const CHIPS = ["cursos", "descargables", "combos", "eventos"] as const;

export function Hero() {
  const t = useTranslations("Hero");
  const tc = useTranslations("Categories.routes");
  return (
    <section className="overflow-hidden bg-band text-band-ink">
      <div className="mx-auto grid min-h-[min(70vh,560px)] max-w-7xl grid-cols-1 items-center gap-8 px-6 pt-12 md:grid-cols-[0.95fr_1.05fr] md:gap-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-12 md:pb-10"
        >
          <p className="inline-block border-l-4 border-band-accent bg-band-ink/10 px-3 py-1 font-display text-sm font-semibold uppercase tracking-[0.18em] text-band-accent">
            {t("kicker")}
          </p>
          <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.9] md:text-8xl">
            {t("title1")}
            <br />
            <span className="text-band-accent">{t("title2")}</span>
          </h1>
          <p className="mt-6 max-w-[40ch] text-xl text-band-ink-soft">{t("tagline")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#destacados"
              className="inline-block rounded-lg bg-sun px-8 py-3.5 font-display text-lg font-bold uppercase tracking-wide text-navy transition-colors hover:brightness-110"
            >
              {t("cta")}
            </a>
            <Link prefetch={false}
              href="/categoria/cursos"
              className="inline-block rounded-lg border border-band-ink/50 px-8 py-3.5 font-display text-lg font-bold uppercase tracking-wide text-band-ink transition-colors hover:bg-band-ink/10"
            >
              {t("cta2")}
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-band-line pt-5">
            {CHIPS.map((route) => (
              <li key={route}>
                <Link prefetch={false}
                  href={`/catalogo/${route}`}
                  className="font-display text-base font-semibold uppercase tracking-wide text-band-ink-soft hover:text-band-accent"
                >
                  {tc(route)}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-last mx-auto w-full max-w-sm self-end md:order-first md:-mb-4 md:-ml-24 md:-mt-28 md:w-[calc(100%+8rem)] md:max-w-none"
        >
          <Image
            src="/images/hero/pelota-manos.webp"
            alt={t("photoAlt")}
            width={1307}
            height={1068}
            preload
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
