"use client";

import type { ReactNode } from "react";

import { useOwnedProduct } from "@/lib/use-owned-product";

// Contenido de venta (p. ej. testimonios): deja de mostrarse a quien ya tiene el producto. Mientras
// se consulta si lo tiene (solo con sesión) tampoco se muestra, para que no aparezca y desaparezca.
export function HideWhenOwned({ slug, children }: { slug: string; children: ReactNode }) {
  const owned = useOwnedProduct(slug);
  if (owned !== false) return null;
  return <>{children}</>;
}
