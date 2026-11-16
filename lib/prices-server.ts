import { EMPTY_PRICE_CATALOG, parsePriceCatalog, type PriceCatalog } from "@/lib/price";

// Precios vigentes desde la API (`GET /precios`), cacheados 5 minutos en el servidor.
export async function getPriceCatalog(): Promise<PriceCatalog> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/precios`, {
      next: { revalidate: 300 },
    });
    return res.ok ? parsePriceCatalog(await res.json()) : EMPTY_PRICE_CATALOG;
  } catch {
    return EMPTY_PRICE_CATALOG;
  }
}
