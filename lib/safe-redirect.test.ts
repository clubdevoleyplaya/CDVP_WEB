import { describe, expect, it } from "vitest";

import { loginHref, safeNextPath } from "./safe-redirect";

describe("safeNextPath", () => {
  it.each([
    ["/admin", "/admin"],
    ["/perfil", "/perfil"],
    ["/reset-password", "/reset-password"],
    ["/catalogo/cursos?orden=precio", "/catalogo/cursos?orden=precio"],
    ["/producto/ataque#detalle", "/producto/ataque#detalle"],
  ])("deja pasar la ruta interna %s", (entrada, esperado) => {
    expect(safeNextPath(entrada)).toBe(esperado);
  });

  it.each([
    "https://sitio-malo.com",
    "http://sitio-malo.com/login",
    "//sitio-malo.com",
    "///sitio-malo.com",
    "/\\sitio-malo.com",
    "\\\\sitio-malo.com",
    "javascript:alert(1)",
    "data:text/html,hola",
    "sitio-malo.com",
    " //sitio-malo.com",
    "/\t/sitio-malo.com",
    "/%2F%2Fsitio-malo.com",
    "/..//sitio-malo.com",
    "",
    "   ",
  ])("rechaza %j y vuelve al inicio", (entrada) => {
    expect(safeNextPath(entrada)).toBe("/");
  });

  it("usa el inicio si no hay valor", () => {
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
  });

  it("acepta otro destino por defecto", () => {
    expect(safeNextPath("https://sitio-malo.com", "/login")).toBe("/login");
  });
});

describe("loginHref", () => {
  it("vuelve a la página de origen", () => {
    expect(loginHref("/curso/armado")).toBe("/login?next=%2Fcurso%2Farmado");
  });
  it("sin origen o con origen peligroso va al login simple", () => {
    expect(loginHref("/")).toBe("/login");
    expect(loginHref(null)).toBe("/login");
    expect(loginHref("//evil.com")).toBe("/login");
    expect(loginHref("/login?next=/x")).toBe("/login");
  });
});
