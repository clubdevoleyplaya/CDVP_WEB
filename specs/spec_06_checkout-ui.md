---
numero: 06
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-08-26
depende_de: [pagos-mercadopago]
complejidad_cafes: 1
---

# Página `/suscripcion` real (no placeholder)

**Dado** un usuario que quiere suscribirse (Pack de Bienvenida + 50% OFF en cursos)
**Cuando** entra a `/suscripcion`
**Entonces** ve el detalle de la suscripción (precio, beneficios) y un botón que lo lleva al pago real, en vez del texto fijo "en construcción" de hoy.

## Casos
- Usuario sin sesión → ve el detalle de la suscripción igual, pero el botón de suscribirse pide iniciar sesión primero (mismo patrón `AuthGuard`/`setLoginOpen`).
- Usuario con sesión, sin suscripción activa → botón "Suscribirme" llama al flujo de pago real (mismo mecanismo que `spec_05_checkout-ui.md`, con el producto/plan de suscripción en vez de un curso puntual).
- Usuario ya suscrito (`isSubscriber` de `useDemoState()`) → la página lo indica en vez de ofrecerle suscribirse de nuevo.
- Reemplaza el placeholder actual (`app/suscripcion/page.tsx`, hoy solo texto + link a "Volver al inicio").

## Referencias
- `app/suscripcion/page.tsx`: contenido actual completo, confirmado por lectura — solo un mensaje estático, sin ningún dato real ni acción.
- `spec_05_checkout-ui.md`: mismo mecanismo de checkout real, reusado acá para el flujo de suscripción.
- `context/demo-state.tsx`: `isSubscriber` ya expuesto por `useDemoState()`, se reusa para el estado "ya suscrito".
- `TODO.md`, backlog de layout (checkout/suscripción sin terminar).
