import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PayThanks } from "@/components/pay-thanks";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PayThanks");
  return { title: t("metaTitle") };
}

export default function GraciasPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-16 text-center">
      <Suspense>
        <PayThanks />
      </Suspense>
    </section>
  );
}
