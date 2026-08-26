---
numero: 05
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-08-26
depende_de: [pagos-mercadopago]
complejidad_cafes: 1
---

# Botón de compra de producto conectado al pago real

**Dado** un usuario logueado en el detalle de un producto (`/producto/[slug]`)
**Cuando** hace click en comprar
**Entonces** el frontend llama a `POST /checkout` real y lo redirige al link de pago de Mercado Pago (`init_point`), en vez de simular el pago localmente.

## Casos
- Click en comprar → llama `POST /checkout` con el `product_id`, muestra un estado de carga mientras espera la respuesta.
- Respuesta con `init_point` → redirige al usuario a esa URL (fuera del sitio, a Mercado Pago).
- Respuesta con error (backend caído, `product_id` inválido, `spec_06_pagos-mercadopago.md` falla en generar el link) → muestra un mensaje de error visible, no deja al usuario en un botón que no hace nada.
- Usuario sin sesión → no se muestra el botón de compra real, se pide iniciar sesión primero (mismo patrón que `AuthGuard`, `components/auth-guard.tsx`).
- Reemplaza el botón actual "Simular pago" y el texto "Demo — no se procesa ningún pago real".

## Referencias
- `components/product-buy-box.tsx`: hoy es simulación pura, botón "Simular pago" sin ningún `fetch`, confirmado leyendo el archivo completo.
- `spec_06_pagos-mercadopago.md` (`CDVP_Api`): expone el `init_point` que este componente consume.
- `components/auth-guard.tsx`: patrón de guard de sesión ya extraído, reusable acá.
