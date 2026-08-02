"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-blue">
          Academia asincrónica de voley playa
        </p>
        <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] md:text-7xl">
          Club de
          <br />
          Voley Playa
        </h1>
        <p className="mt-5 max-w-[38ch] text-lg italic text-ink-soft">
          &ldquo;Hoy mismo podés empezar a convertirte en un atleta profesional de voley
          playa.&rdquo;
        </p>
        <a
          href="#destacados"
          className="mt-8 inline-block rounded-lg bg-blue px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:brightness-110"
        >
          Ver productos
        </a>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto w-full max-w-xs md:max-w-sm"
      >
        <Image
          src="/brand/ball.png"
          alt="Pelota de voley playa — Club de Voley Playa"
          width={650}
          height={648}
          preload
          className="h-auto w-full drop-shadow-xl"
        />
      </motion.div>
    </section>
  );
}
