// Solo se aceptan rutas internas del sitio. Cualquier otra cosa (otro dominio, "//host",
// esquemas como javascript:) vuelve al destino por defecto, para evitar redirecciones abiertas.
export function safeNextPath(next: string | null | undefined, fallback = "/"): string {
  if (typeof next !== "string" || next.trim() !== next || next === "") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f\u007f\\]/.test(next)) return fallback;

  try {
    const base = "http://interno.invalid";
    const url = new URL(next, base);
    if (url.origin !== base) return fallback;
    if (url.pathname.startsWith("//") || url.pathname.includes("/..")) return fallback;
    if (/^\/(%2f|%5c)/i.test(url.pathname)) return fallback;
  } catch {
    return fallback;
  }
  return next;
}
