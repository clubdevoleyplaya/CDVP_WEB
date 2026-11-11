import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PaddleCheckout } from "@/components/paddle-checkout";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pay");
  return { title: t("metaTitle") };
}

export default async function PagarPage() {
  const t = await getTranslations("Pay");
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">{t("title")}</h1>
      <Suspense>
        <PaddleCheckout />
      </Suspense>
    </section>
  );
}
