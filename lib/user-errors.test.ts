import { describe, expect, it } from "vitest";

import { apiErrorMessage } from "./user-errors";

const FALLBACK = "genérico";

describe("apiErrorMessage", () => {
  it.each([400, 409, 429])("muestra el mensaje del API en un %s", (status) => {
    expect(apiErrorMessage(status, { detail: "El código no es válido." }, FALLBACK)).toBe(
      "El código no es válido.",
    );
  });

  it.each([401, 403, 404, 422, 500, 502, 503])("nunca muestra el detalle en un %s", (status) => {
    expect(apiErrorMessage(status, { detail: "mercadopago no configurado" }, FALLBACK)).toBe(FALLBACK);
  });

  it.each([
    [null],
    [undefined],
    [{}],
    [{ detail: 42 }],
    [{ detail: ["lista"] }],
    [{ detail: "" }],
    [{ detail: "   " }],
    [{ detail: "x".repeat(500) }],
    [{ detail: "<script>alert(1)</script>" }],
    [{ detail: "línea\nconsalto" }],
  ])("cae en el texto propio con %j", (body) => {
    expect(apiErrorMessage(400, body, FALLBACK)).toBe(FALLBACK);
  });
});
