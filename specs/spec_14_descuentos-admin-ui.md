---
numero: 14
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-29
depende_de: [descuento-suscriptor, goteo-admin-ui]
complejidad_cafes: 1
---

# Pantalla de descuentos: Juli elige cuánto descuenta cada categoría

**Dado** la administradora dentro de `/admin/descuentos`
**Cuando** cambia el porcentaje de una categoría y guarda
**Entonces** el cambio queda aplicado para las próximas compras de los suscriptores, y ve cuánto costaría un producto de ejemplo antes de confirmar.

## Casos
- La pantalla lista las 4 categorías (cursos, eventos, combos, descargables), cada una con su porcentaje actual.
- Al escribir un porcentaje se muestra en vivo el precio final de un producto de ejemplo de esa categoría, sin guardar todavía.
- Al guardar, aparece un aviso de "guardado"; si el servidor rechaza el valor (fuera de 0 a 100), se muestra el motivo con palabras simples.
- Un porcentaje vacío o que no es un número no permite guardar.
- Si la persona no es administradora, no ve la pantalla (mismo control que goteo y cuestionarios).
- Mientras se cargan los porcentajes se muestra un esqueleto de carga, y si falla la carga, un mensaje de error en vez de una pantalla en blanco.

## Referencias
- `spec_16_descuento-suscriptor.md` (CDVP_Api) — contrato de los endpoints que esta pantalla consume.
- `app/admin/goteo/page.tsx` y `components/goteo-capsule-editor.tsx` — mismo patrón de pantalla de admin (`AuthGuard role="admin"`, carga con sesión, guardado).
- Pedido de Juli/Julián (2026-09-29): administrar descuentos desde el panel de admin.
