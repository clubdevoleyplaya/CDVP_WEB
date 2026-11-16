import { describe, expect, it } from "vitest";

import { computeDisplayPrice, formatPrice, parsePriceCatalog, paymentProviderFor } from "./price";

const product = { slug: "ataque", category: "curso" as const };
const entry = {
  ars: 50000,
  usd: 50,
  compareArs: null,
  compareUsd: null,
  eur: null,
  compareEur: null,
  discountable: true,
};
const prices = { ataque: entry };
const eur = { ataque: { ...entry, eur: 45 } };

describe("formatPrice", () => {
  it("da formato por moneda", () => {
    expect(formatPrice(50, "USD")).toBe("$50 USD");
    expect(formatPrice(45, "EUR")).toBe("€45 EUR");
    expect(formatPrice(50000, "ARS")).toBe("$50.000 ARS");
  });
});

describe("computeDisplayPrice en euros", () => {
  it("usa el precio en euros ya revisado, no una conversión", () => {
    expect(computeDisplayPrice(product, "EUR", false, undefined, eur)?.now).toBe(45);
  });

  it("el descuento de suscriptor se aplica sobre el precio en euros", () => {
    const price = computeDisplayPrice(product, "EUR", true, { curso: 50, evento: 10, combo: 0, descargable: 0 }, eur);
    expect(price).toEqual({ now: 22.5, old: 45, showOld: true });
  });

  it("el tachado en euros sale de compare_eur", () => {
    const withCompare = { ataque: { ...entry, eur: 150, compareEur: 355 } };
    expect(computeDisplayPrice(product, "EUR", false, undefined, withCompare)).toEqual({ now: 150, old: 355, showOld: true });
  });

  it("pesos y dólares no cambian", () => {
    expect(computeDisplayPrice(product, "ARS", false, undefined, prices)?.now).toBe(50000);
    expect(computeDisplayPrice(product, "USD", false, undefined, prices)?.now).toBe(50);
  });
});

describe("computeDisplayPrice sin precio cargado", () => {
  it("devuelve null en vez de inventar un valor", () => {
    expect(computeDisplayPrice(product, "ARS", false, undefined, {})).toBeNull();
  });

  it("sin euro revisado para ese producto, cae a dólares", () => {
    expect(computeDisplayPrice(product, "EUR", false, undefined, prices)?.now).toBe(50);
  });

  it("solo descuenta si el producto es descontable", () => {
    const noDesc = { ataque: { ...entry, discountable: false } };
    const pct = { curso: 50, evento: 10, combo: 0, descargable: 0 };
    expect(computeDisplayPrice(product, "USD", true, pct, noDesc)).toEqual({ now: 50, old: 50, showOld: false });
  });
});

describe("parsePriceCatalog", () => {
  it("mapea la respuesta de GET /precios", () => {
    const parsed = parsePriceCatalog({
      precios: { ataque: { ars: "50000.00", usd: 50, compare_ars: null, compare_usd: null, eur: 45, compare_eur: null, discountable: true } },
      eur_completo: true,
    });
    expect(parsed.eurComplete).toBe(true);
    expect(parsed.prices.ataque).toEqual({ ...entry, eur: 45 });
  });

  it("respuesta vacía o rota no revienta", () => {
    expect(parsePriceCatalog(null)).toEqual({ prices: {}, eurComplete: false });
  });
});

describe("paymentProviderFor", () => {
  it("MercadoPago solo cobra en pesos; dólares y euros van por Paddle", () => {
    expect(paymentProviderFor("ARS")).toBe("mercadopago");
    expect(paymentProviderFor("USD")).toBe("paddle");
    expect(paymentProviderFor("EUR")).toBe("paddle");
  });
});
