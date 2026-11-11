// Errores del API hacia la persona. Se desconfía de todo lo que venga de afuera (Supabase, la API, la
// URL): el motivo real queda en los logs de Railway y acá solo se muestran textos propios, fijos y
// traducidos (messages/*.json).

// El API manda un `code` estable en cada error. Solo los códigos de esta lista (casos pensados para
// la persona) se traducen y se muestran; cualquier otro, o un `detail` suelto, cae en el texto
// propio de la pantalla. Nunca se refleja texto que venga de afuera.
export const PUBLIC_ERROR_CODES = [
  "promo_code_invalid",
  "subscription_active",
  "clause_not_accepted",
  "too_many_requests",
] as const;
export type PublicErrorCode = (typeof PUBLIC_ERROR_CODES)[number];

const MESSAGE_STATUSES = new Set([400, 409, 429]);

export function publicErrorCode(status: number, body: unknown): PublicErrorCode | null {
  if (!MESSAGE_STATUSES.has(status)) return null;
  const code = (body as { code?: unknown } | null)?.code;
  return PUBLIC_ERROR_CODES.find((known) => known === code) ?? null;
}
