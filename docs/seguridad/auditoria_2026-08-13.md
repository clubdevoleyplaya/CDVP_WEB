# Auditoría de seguridad — CDVP_WEB — 2026-08-13

## Resumen
La protección de rutas admin (`/admin/*`) está bien implementada: valida sesión contra el server (no confía en la cookie sola) y redirige tanto a usuarios sin sesión como a usuarios sin rol admin. `npm audit` en producción no encontró vulnerabilidades. El hallazgo más importante de esta pasada en realidad vive en `CDVP_Api` (self-escalación de `role` vía RLS, ver su propio reporte) pero afecta directamente a esta app porque es la que consulta ese campo para decidir acceso a `/admin`.

## Hallazgos

| ID (checklist) | Estado | Evidencia | Severidad | Acción sugerida |
|---|---|---|---|---|
| A01 | ✅ | `proxy.ts` (Next.js 16 renombró `middleware.ts` → `proxy.ts`, mismo mecanismo): usa `supabase.auth.getUser()` (valida contra el server, no `getSession()` que solo lee la cookie) — comentario explícito en el código sobre por qué. Sin sesión → redirect a `/login?next=...`; con sesión pero `role !== "admin"` → redirect a `/`. Confirmado en vivo: `curl -i http://localhost:3000/admin/analytics` → `307` a `/login?next=%2Fadmin%2Fanalytics` + headers de seguridad esperados. | — | — |
| A01 | ⚠️ | `app/admin/analytics/page.tsx` tiene un comentario que dice "protegida por rol en el middleware" pero el componente no tiene ninguna verificación propia — la protección real es 100% de `proxy.ts`. No es una falla en sí (la protección existe y es server-side), pero si algún día se agrega otra ruta bajo `/admin` sin pasar por el matcher del proxy, quedaría desprotegida sin que el código lo avise. | Baja | Ninguna acción urgente — al agregar rutas nuevas bajo `/admin`, confirmar que caen dentro del `matcher` de `proxy.ts`. |
| A01 | ⚠️ | Ver hallazgo alto en `CDVP_Api/docs/seguridad/auditoria_2026-08-13.md` (RLS de `profiles.role` sin `with check`): como `proxy.ts` decide el acceso a `/admin` leyendo `profiles.role` directo de Supabase, un usuario que se auto-asigne `role='admin'` vía RLS pasa también este chequeo. La causa raíz y el fix viven en `CDVP_Api`, pero el impacto llega hasta acá. | Alta (heredada de CDVP_Api) | Aplicar el fix de RLS documentado en el reporte de `CDVP_Api`. |
| A02 | parcial | `lib/supabase/client.ts`/`server.ts`/`proxy.ts`: no se pasan opciones custom de cookies, se usa el default de `@supabase/ssr` (patrón oficial recomendado por Supabase). No se pudo verificar en vivo los flags reales (`httpOnly`/`secure`/`sameSite`) del `Set-Cookie` de una sesión autenticada real — no había credenciales de un usuario logueado para probarlo desde acá. | — | Ver `## Pendientes`. |
| A05 | ✅ | `next.config.ts`: `securityHeaders` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy `camera=(), microphone=(), geolocation=()`) aplicados a `/:path*`. CSP diferido a propósito (comentario explícito: hasta definir orígenes finales de embeds YouTube/Drive) — decisión razonada, no un olvido. | — | Definir CSP cuando se cierre la lista de orígenes embebidos. |
| A06 | ✅ | `npm audit --omit=dev`: `found 0 vulnerabilities`. Dependabot (`npm`+`github-actions`) activo. `ci.yml` corre `npm audit --omit=dev --audit-level=high` en cada push/PR. | — | — |
| A07 | ✅ | Auth 100% delegada a Supabase Auth (`@supabase/ssr`), sin reimplementación propia de login/sesión. | — | — |
| CDVP-01 | parcial | `components/testimonials.tsx`: embeds de YouTube con `modestbranding=1&rel=0` (sin recomendados de otros canales, mínimo branding posible vía embed — no se puede remover el ícono de YouTube por completo, es parte de sus ToS). Visor de PDF y proxy de Drive todavía no existen en el frontend (dependen de `contenido-drive-youtube` en `CDVP_Api`, sin construir). | — | — |

## Checklist externo (safeguards de video de referencia, 2026-08-13)
El usuario pidió evaluar una lista de 10 puntos de un video externo tipo "errores comunes de SaaS". Evaluado punto por punto contra el código real de CDVP:

| # | Punto | Aplica a CDVP | Evidencia |
|---|---|---|---|
| 1 | No Privacy Policy | **Sí, gap real** | `find app -iname "*privac*" -o -iname "*terms*" -o -iname "*legal*"` → sin resultados. No existe ninguna página de privacidad/términos. |
| 2 | No "We collect user data" | **Sí, gap real** | Consecuencia directa del #1 — sin política, no hay dónde declararlo. |
| 3 | No mención de uso de AI en la Política de Privacidad | No aplica | `grep -rln "langchain\|openai\|OpenAI\|chatbot" app/` → sin resultados. CDVP no usa AI en ningún flujo de producto (los paquetes `langchain-core`/`langchain-openai` que aparecieron en el primer `pip-audit` eran falso positivo por auditar el Python del sistema, no el `.venv` del proyecto — confirmado con el `.venv` real, ver reporte de `CDVP_Api`). |
| 4 | No mención de terceros que procesan datos | **Sí, gap real** | Terceros reales que sí procesan datos de usuarios: Supabase (auth/DB/storage), MercadoPago (pagos), YouTube (embeds, IP del visitante). Ninguno está declarado porque no hay política de privacidad. |
| 5 | No borrar uploads / datos de usuario a pedido | **Sí, gap real** | `grep -rln "delete_account\|eliminar.*cuenta"` en `app/` de ambos repos → sin resultados. No existe ningún flujo de baja/eliminación de cuenta o datos. |
| 6 | Storage Bucket = Public | Revisado, correcto | `supabase/migrations/20260801000009_profile_community.sql`: el único bucket es `avatars`, `public=true` a propósito (lectura abierta de avatares, como cualquier red social), con policies que limitan `insert`/`update` a la carpeta del propio usuario (`auth.uid()::text = foldername`). No hay ningún otro bucket. Configuración intencional y bien acotada, no es el error del checklist (bucket con contenido privado/pago expuesto). |
| 7 | Fake testimonials | No aplica, ya corregido | Los testimonios de texto citan personas reales (Fernando Ariel Mezzera, Hugo Morgado, `lib/products.ts`) y los de video son Shorts reales de YouTube subidos por Juli (IDs provistos 2026-08-13, ver `components/testimonials.tsx`). Nada inventado. |
| 8 | Cancelar más difícil que darse de alta | No aplica todavía | `app/suscripcion/page.tsx`: la pasarela de pago está "en construcción", no hay suscripciones activas todavía, por lo tanto tampoco hay flujo de cancelación que evaluar. Anotado para diseñarlo bien desde el arranque (ver abajo). |
| 9 | Auto-renovación sin recordatorio | No aplica todavía | Mismo motivo que el #8 — no hay suscripciones activas todavía. |
| 10 | AI sin respuesta ante auto-daño | No aplica | Mismo hallazgo que el #3 — no hay ninguna feature de AI/chatbot en CDVP. |

**Gaps reales a resolver: #1, #2, #4, #5.** Para formalizarlos como specs (`privacidad-datos` o similar) hace falta agregar antes la fila correspondiente en `context/NOMENCLATURA_SPECS.md` — la nomenclatura no tiene hoy un componente para esto y su propia regla exige acuerdo explícito antes de inventar uno. **Los puntos #8/#9 son válidos para cuando se construya el checkout real** (`pagos-mercadopago`/`checkout-ui`, hoy no implementados) — dejar anotado en `TODO.md` para no repetir el error al construirlos.

## Pendientes (requieren entorno desplegado o credenciales)
- A02 — Confirmar flags reales (`httpOnly`/`secure`/`sameSite`) del `Set-Cookie` de una sesión autenticada real; requiere loguearse con un usuario real y leer el header, no se pudo desde acá sin credenciales.
- A05 — CSP real una vez definida.

## Comparado con la auditoría anterior
Primera auditoría formal con reporte escrito — no hay una anterior con la que comparar.
