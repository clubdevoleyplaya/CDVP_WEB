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
    <section className="bg-band text-white">
      <div className="mx-auto grid min-h-[min(80vh,720px)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="inline-block border-l-4 border-sun bg-white/10 px-3 py-1 font-display text-sm font-semibold uppercase tracking-[0.18em] text-sun">
            {t("kicker")}
          </p>
          <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.9] md:text-8xl">
            {t("title1")}
            <br />
            <span className="text-sun">{t("title2")}</span>
          </h1>
          <p className="mt-6 max-w-[40ch] text-xl text-white/80">{t("tagline")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#destacados"
              className="inline-block rounded-lg bg-sun px-8 py-3.5 font-display text-lg font-bold uppercase tracking-wide text-band transition-colors hover:brightness-110"
            >
              {t("cta")}
            </a>
            <Link
              href="/categoria/cursos"
              className="inline-block rounded-lg border border-white/60 px-8 py-3.5 font-display text-lg font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              {t("cta2")}
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-5">
            {CHIPS.map((route) => (
              <li key={route}>
                <Link
                  href={`/catalogo/${route}`}
                  className="font-display text-base font-semibold uppercase tracking-wide text-white/70 hover:text-sun"
                >
                  {tc(route)}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-md"
        >
          <Image
            src="/images/juli/recepcion.jpg"
            alt={t("photoAlt")}
            width={681}
            height={450}
            preload
            className="h-auto w-full rounded-2xl border-4 border-white shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
