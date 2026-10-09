import { describe, expect, it } from "vitest";

import { sessionIsDead } from "./session-check";

const ok = { data: { user: { id: "1" } }, error: null };
const withError = (error: { status?: number; code?: string }) => ({ data: { user: null }, error });

describe("sessionIsDead", () => {
  it("la sesión de un usuario existente sigue viva", async () => {
    expect(await sessionIsDead(async () => ok)).toBe(false);
  });

  it("un usuario borrado cierra la sesión", async () => {
    expect(await sessionIsDead(async () => withError({ status: 403, code: "user_not_found" }))).toBe(true);
  });

  it.each([401, 403])("un %s de autenticación cierra la sesión", async (status) => {
    expect(await sessionIsDead(async () => withError({ status }))).toBe(true);
  });

  it.each(["bad_jwt", "session_not_found", "refresh_token_not_found"])("el código %s cierra la sesión", async (code) => {
    expect(await sessionIsDead(async () => withError({ code }))).toBe(true);
  });

  it("un corte de red o un 5xx no cierra la sesión", async () => {
    expect(await sessionIsDead(async () => withError({ status: 0 }))).toBe(false);
    expect(await sessionIsDead(async () => withError({ status: 503 }))).toBe(false);
    expect(await sessionIsDead(async () => { throw new Error("offline"); })).toBe(false);
  });

  it("sin usuario y sin error se considera muerta", async () => {
    expect(await sessionIsDead(async () => ({ data: { user: null }, error: null }))).toBe(true);
  });
});
