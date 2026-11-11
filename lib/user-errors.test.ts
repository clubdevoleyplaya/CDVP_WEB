import { describe, expect, it } from "vitest";

import { PUBLIC_ERROR_CODES, publicErrorCode } from "./user-errors";

describe("publicErrorCode", () => {
  it.each([
    [400, "promo_code_invalid"],
    [409, "subscription_active"],
    [409, "clause_not_accepted"],
    [429, "too_many_requests"],
    [400, "email_invalid"],
  ])("devuelve el código conocido de un %s", (status, code) => {
    expect(publicErrorCode(status, { detail: "x", code })).toBe(code);
  });

  it.each([401, 403, 404, 422, 500, 502, 503])("nunca devuelve código en un %s", (status) => {
    expect(publicErrorCode(status, { code: "promo_code_invalid" })).toBeNull();
  });

  it.each([
    [null],
    [undefined],
    [{}],
    [{ code: 42 }],
    [{ code: "bad_request" }],
    [{ code: "<script>alert(1)</script>" }],
    [{ detail: "El código no es válido." }],
  ])("ignora lo que no es un código público: %j", (body) => {
    expect(publicErrorCode(400, body)).toBeNull();
  });

  it("la lista pública coincide con los códigos de PublicError de la API", () => {
    expect([...PUBLIC_ERROR_CODES].sort()).toEqual(
      ["clause_not_accepted", "email_invalid", "promo_code_invalid", "subscription_active", "too_many_requests"],
    );
  });
});
