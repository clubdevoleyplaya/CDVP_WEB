import { describe, expect, it } from "vitest";

import { detectCurrency, detectLocale, localeFromAcceptLanguage } from "./locale";

describe("detectLocale", () => {
  it("la cookie gana a Accept-Language", () => {
    expect(detectLocale({ localeCookie: "pt", acceptLanguage: "en-US,en;q=0.9" })).toBe("pt");
  });

  it("sin cookie usa el primer idioma soportado de Accept-Language", () => {
    expect(detectLocale({ acceptLanguage: "pt-BR,pt;q=0.9,en;q=0.8" })).toBe("pt");
    expect(detectLocale({ acceptLanguage: "en-GB" })).toBe("en");
    expect(detectLocale({ acceptLanguage: "es-AR,es;q=0.9" })).toBe("es");
  });

  it("respeta el peso q y salta idiomas no soportados", () => {
    expect(localeFromAcceptLanguage("fr;q=0.9,en;q=0.5,pt;q=0.8")).toBe("pt");
    expect(localeFromAcceptLanguage("fr-FR,de;q=0.8,en;q=0.4")).toBe("en");
  });

  it("idioma desconocido, vacío o cookie inválida cae en español", () => {
    expect(detectLocale({ acceptLanguage: "ja-JP" })).toBe("es");
    expect(detectLocale({ acceptLanguage: "" })).toBe("es");
    expect(detectLocale({})).toBe("es");
    expect(detectLocale({ localeCookie: "<script>", acceptLanguage: "en" })).toBe("en");
  });

  it("ignora idiomas con q=0 y el comodín", () => {
    expect(localeFromAcceptLanguage("en;q=0, *;q=0.5, pt;q=0.1")).toBe("pt");
  });
});

describe("detectCurrency", () => {
  it("la cookie gana a todo", () => {
    expect(detectCurrency({ currencyCookie: "USD", country: "AR", acceptLanguage: "es-AR" })).toBe("USD");
    expect(detectCurrency({ currencyCookie: "ARS", country: "US" })).toBe("ARS");
  });

  it("el país manda sobre el idioma: Argentina paga en pesos y el resto en dólares", () => {
    expect(detectCurrency({ country: "AR", acceptLanguage: "en-US" })).toBe("ARS");
    expect(detectCurrency({ country: "cl", acceptLanguage: "es-AR" })).toBe("USD");
    expect(detectCurrency({ country: "BR" })).toBe("USD");
  });

  it("sin país, la región de Accept-Language: es-AR → ARS, otra región → USD", () => {
    expect(detectCurrency({ acceptLanguage: "es-AR,es;q=0.9" })).toBe("ARS");
    expect(detectCurrency({ acceptLanguage: "en-US,en;q=0.9" })).toBe("USD");
    expect(detectCurrency({ acceptLanguage: "pt-BR" })).toBe("USD");
  });

  it("sin ninguna señal usa pesos, como hasta ahora", () => {
    expect(detectCurrency({})).toBe("ARS");
    expect(detectCurrency({ acceptLanguage: "es" })).toBe("ARS");
  });

  it("ignora países de relleno o inválidos", () => {
    expect(detectCurrency({ country: "XX", acceptLanguage: "es-AR" })).toBe("ARS");
    expect(detectCurrency({ country: "T1", acceptLanguage: "en-US" })).toBe("USD");
    expect(detectCurrency({ country: "ARG" })).toBe("ARS");
  });
});
