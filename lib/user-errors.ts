// Mensajes que ve la persona. Se desconfía de todo lo que venga de afuera (Supabase, la API, la
// URL): el motivo real queda en los logs de Railway y acá solo se muestran textos propios, fijos.

export const USER_MESSAGES = {
  signup: "No pudimos crear la cuenta. Revisá los datos y probá de nuevo.",
  forgotPassword: "No pudimos procesar el pedido. Probá de nuevo en unos minutos.",
  resetPassword:
    "No pudimos cambiar la contraseña. Es posible que el enlace haya vencido: pedí uno nuevo.",
  invalidLink: "El enlace no es válido o ya venció. Pedí uno nuevo e intentá de nuevo.",
  paymentLink: "No se pudo generar el link de pago. Probá de nuevo en unos minutos.",
  checkout: "No se pudo procesar la compra. Probá de nuevo.",
} as const;

// Solo estos estados llevan un mensaje pensado para la persona (el API los marca como públicos):
// el resto (401, 403, 404, 5xx) nunca se muestra, aunque traiga un `detail`.
const MESSAGE_STATUSES = new Set([400, 409, 429]);
const MAX_LENGTH = 160;

export function apiErrorMessage(status: number, body: unknown, fallback: string): string {
  if (!MESSAGE_STATUSES.has(status)) return fallback;
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail !== "string") return fallback;
  const clean = detail.trim();
  if (!clean || clean.length > MAX_LENGTH || /[\u0000-\u001f\u007f<>]/.test(clean)) return fallback;
  return clean;
}
