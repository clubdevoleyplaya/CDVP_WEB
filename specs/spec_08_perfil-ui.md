---
numero: 08
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-08-26
depende_de: [perfil-ui, suscripcion-recurrente]
complejidad_cafes: 1
---

# Perfil: ver y cancelar la suscripción real

**Dado** un usuario logueado que entra a su perfil
**Cuando** la página carga su estado de suscripción
**Entonces** ve si está suscripto de verdad (no un dato simulado) y, si lo está, puede cancelarla ahí mismo sin tener que escribir por WhatsApp.

## Casos
- Usuario con suscripción activa → ve su estado y un botón "Cancelar suscripción".
- Usuario sin suscripción (nunca se suscribió, o ya la canceló) → no ve el botón de cancelar.
- Confirma la cancelación → se pide una confirmación simple antes de ejecutarla (no se cancela con un solo clic accidental).
- Cancelación exitosa → el estado se actualiza en la misma página sin recargar, deja de verse el botón.
- Falla la cancelación (backend caído) → mensaje de error visible, la suscripción sigue activa, el usuario puede reintentar.

## Referencias
- `app/perfil/page.tsx`: página existente que este spec extiende con la sección de suscripción.
- `context/demo-state.tsx`: estado de `me` que ya trae `subscription_status` desde `GET /me`, este spec lo usa en vez de un dato mockeado.
- `CDVP_Api/specs/spec_08_suscripcion-recurrente.md`: endpoint de cancelación que este formulario consume.
- `context/NOMENCLATURA_SPECS.md`, fila `perfil-ui`: "Página de perfil, suscripción, descuento visible" — este spec resuelve la parte de suscripción que quedaba pendiente.
