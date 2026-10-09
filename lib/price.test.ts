import { describe, expect, it } from "vitest";

import { computeDisplayPrice, formatPrice, paymentProviderFor } from "./price";

const product = {
  slug: "ataque",
  priceArs: 50000,
  priceUsd: 50,
  compareArs: undefined,
  compareUsd: undefined,
  discountable: true,
  category: "curso" as const,
};
const eur = { ataque: { price: 45, compare: null } };

describe("formatPrice", () => {
  it("da formato por moneda", () => {
    expect(formatPrice(50, "USD")).toBe("$50 USD");
    expect(formatPrice(45, "EUR")).toBe("€45 EUR");
    expect(formatPrice(50000, "ARS")).toBe("$50.000 ARS");
  });
});

describe("computeDisplayPrice en euros", () => {
  it("usa el precio en euros ya revisado, no una conversión", () => {
    expect(computeDisplayPrice(product, "EUR", false, undefined, eur).now).toBe(45);
  });

  it("el descuento de suscriptor se aplica sobre el precio en euros", () => {
    const price = computeDisplayPrice(product, "EUR", true, { curso: 50, evento: 10, combo: 0, descargable: 0 }, eur);
    expect(price).toEqual({ now: 22.5, old: 45, showOld: true });
  });

  it("el tachado en euros sale de compare_eur", () => {
    const withCompare = { ataque: { price: 150, compare: 355 } };
    expect(computeDisplayPrice(product, "EUR", false, undefined, withCompare)).toEqual({ now: 150, old: 355, showOld: true });
  });

  it("pesos y dólares no cambian", () => {
    expect(computeDisplayPrice(product, "ARS", false).now).toBe(50000);
    expect(computeDisplayPrice(product, "USD", false).now).toBe(50);
  });
});

describe("paymentProviderFor", () => {
  it("MercadoPago solo cobra en pesos; dólares y euros van por Paddle", () => {
    expect(paymentProviderFor("ARS")).toBe("mercadopago");
    expect(paymentProviderFor("USD")).toBe("paddle");
    expect(paymentProviderFor("EUR")).toBe("paddle");
  });
});
