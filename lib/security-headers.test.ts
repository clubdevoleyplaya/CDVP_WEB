import { describe, expect, it } from "vitest";

import { buildCsp, securityHeaders } from "./security-headers";

const env = {
  isDev: false,
  apiUrl: "https://api.clubdevoleyplaya.com",
  supabaseUrl: "https://abcd1234.supabase.co",
};

function directive(csp: string, name: string): string[] {
  const found = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith(`${name} `) || d === name);
  return found ? found.split(/\s+/).slice(1) : [];
}

describe("buildCsp", () => {
  const csp = buildCsp(env);

  it("bloquea objetos, embebido propio y cambios de base", () => {
    expect(directive(csp, "default-src")).toEqual(["'self'"]);
    expect(directive(csp, "object-src")).toEqual(["'none'"]);
    expect(directive(csp, "frame-ancestors")).toEqual(["'none'"]);
    expect(directive(csp, "base-uri")).toEqual(["'self'"]);
    expect(directive(csp, "form-action")).toEqual(["'self'"]);
  });

  it("permite el script de Paddle y ningún otro origen externo", () => {
    const scripts = directive(csp, "script-src");
    expect(scripts).toContain("https://cdn.paddle.com");
    expect(scripts.filter((s) => s.startsWith("http"))).toEqual(["https://cdn.paddle.com"]);
  });

  it("no permite eval en producción, y sí en desarrollo", () => {
    expect(directive(csp, "script-src")).not.toContain("'unsafe-eval'");
    expect(directive(buildCsp({ ...env, isDev: true }), "script-src")).toContain("'unsafe-eval'");
  });

  it("permite los iframes que usa el sitio: Vimeo, YouTube y el checkout de Paddle", () => {
    const frames = directive(csp, "frame-src");
    expect(frames).toEqual(
      expect.arrayContaining([
        "https://player.vimeo.com",
        "https://www.youtube.com",
        "https://*.paddle.com",
      ]),
    );
  });

  it("permite conectar solo a la API, a Supabase y a Paddle", () => {
    const connect = directive(csp, "connect-src");
    expect(connect).toEqual(
      expect.arrayContaining([
        "'self'",
        "https://api.clubdevoleyplaya.com",
        "https://abcd1234.supabase.co",
        "wss://abcd1234.supabase.co",
        "https://*.paddle.com",
      ]),
    );
    expect(connect).not.toContain("*");
  });

  it("acepta imágenes de https y data, para avatares y banners", () => {
    expect(directive(csp, "img-src")).toEqual(expect.arrayContaining(["'self'", "data:", "blob:", "https:"]));
  });

  it("no revienta si faltan las URLs: omite esos orígenes", () => {
    const sinUrls = buildCsp({ isDev: false, apiUrl: undefined, supabaseUrl: "no es una url" });
    expect(directive(sinUrls, "connect-src")).toEqual(expect.arrayContaining(["'self'", "https://*.paddle.com"]));
    expect(sinUrls).not.toContain("undefined");
  });

  it("en desarrollo permite la API local por http", () => {
    const dev = buildCsp({ isDev: true, apiUrl: "http://127.0.0.1:8000", supabaseUrl: "https://abcd1234.supabase.co" });
    expect(directive(dev, "connect-src")).toContain("http://127.0.0.1:8000");
  });
});

describe("securityHeaders", () => {
  const headers = securityHeaders(env);
  const get = (key: string) => headers.find((h) => h.key === key)?.value;

  it("mantiene las cabeceras que ya existían", () => {
    expect(get("X-Content-Type-Options")).toBe("nosniff");
    expect(get("X-Frame-Options")).toBe("DENY");
    expect(get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(get("Permissions-Policy")).toContain("camera=()");
  });

  it("agrega HSTS de un año sin includeSubDomains ni preload", () => {
    const hsts = get("Strict-Transport-Security");
    expect(hsts).toBe("max-age=31536000");
  });

  it("publica el CSP solo como reporte, sin bloquear nada todavía", () => {
    expect(get("Content-Security-Policy-Report-Only")).toContain("default-src 'self'");
    expect(get("Content-Security-Policy")).toBeUndefined();
  });

  it("en desarrollo no manda HSTS", () => {
    const dev = securityHeaders({ ...env, isDev: true });
    expect(dev.find((h) => h.key === "Strict-Transport-Security")).toBeUndefined();
  });
});
