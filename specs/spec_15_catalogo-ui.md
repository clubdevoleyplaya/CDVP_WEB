---
numero: 15
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-29
depende_de: [descuento-suscriptor, catalogo-ui]
complejidad_cafes: 1
---

# El precio con descuento que se ve es el mismo que se cobra

**Dado** un suscriptor activo mirando el catálogo, una ficha de producto o el carrito
**Cuando** la web calcula el precio con descuento
**Entonces** usa los porcentajes vigentes que le informa el servidor, no números escritos en la web, así lo que ve coincide con lo que se le cobra.

## Casos
- Con los valores iniciales (cursos 50%, eventos 10%) el precio mostrado no cambia respecto de hoy.
- Si Juli cambia los combos a 20%, el suscriptor ve el combo con precio tachado y 20% menos, en catálogo, ficha y carrito.
- Quien no tiene suscripción activa (o no inició sesión) sigue viendo el precio completo, sin tachado.
- Si no se pueden obtener los porcentajes del servidor, la web usa los valores iniciales en vez de romperse; el cobro real igual lo decide el servidor.
- Los carteles de promoción ("50% OFF para suscriptores" en catálogo y barra superior) muestran el porcentaje vigente, también para visitantes sin sesión.
- Un producto marcado como no descontable no muestra descuento aunque su categoría tenga porcentaje.

## Referencias
- `lib/price.ts::computeDisplayPrice` — recibe los porcentajes vigentes (antes un mapa fijo `DISCOUNT_MULTIPLIER_BY_CATEGORY`); `components/category-discount-note.tsx` y `components/demo-bar.tsx` para los carteles.
- `context/demo-state.tsx` — estado compartido de sesión/suscripción donde se guardan los porcentajes.
- `spec_16_descuento-suscriptor.md` (CDVP_Api) — endpoint que informa los porcentajes vigentes.
- Bug real ya corregido (2026-08-28): la web mostraba un 20% fijo distinto al del servidor; este spec evita que vuelva a pasar.
