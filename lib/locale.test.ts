import { describe, expect, it } from "vitest";

import { currencyFromCookie, detectLocale, localeFromAcceptLanguage } from "./locale";

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

describe("currencyFromCookie", () => {
  it("usa la moneda que la persona eligió", () => {
    expect(currencyFromCookie("USD")).toBe("USD");
    expect(currencyFromCookie("ARS")).toBe("ARS");
  });

  it("sin elección, o con una cookie inválida, son pesos", () => {
    expect(currencyFromCookie(undefined)).toBe("ARS");
    expect(currencyFromCookie(null)).toBe("ARS");
    expect(currencyFromCookie("EUR")).toBe("ARS");
  });
});
