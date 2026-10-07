import { Suspense } from "react";
import type { Metadata } from "next";
import { PaddleCheckout } from "@/components/paddle-checkout";

export const metadata: Metadata = { title: "Pagar — Club de Voley Playa" };

export default function PagarPage() {
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold uppercase">Finalizar compra</h1>
      <Suspense>
        <PaddleCheckout />
      </Suspense>
    </section>
  );
}
