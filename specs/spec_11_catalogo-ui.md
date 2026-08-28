---
numero: 11
estado: implementado
fecha: 2026-08-28
depende_de: []
complejidad_cafes: 1
---

# Categoría "evento" visible en el catálogo

**Dado** que el catálogo hoy solo conoce cursos, descargables y combos
**Cuando** se publica un producto de categoría "evento" (ej. un campamento puntual)
**Entonces** aparece en su propia sección del catálogo con el 10% de descuento para suscriptores, en vez de quedar invisible o mal etiquetado.

## Casos
- Producto con `category: "evento"` → aparece en una sección propia del catálogo (`/catalogo/eventos`), con label "Evento".
- Suscriptor activo ve un evento → precio mostrado con 10% OFF, no el 50% que hoy se usa para cursos.
- Evento con `discountable: false` → se muestra el precio base, igual que ya funciona hoy para otras categorías con esa bandera.
- El menú/nav de catálogo suma la categoría eventos junto a cursos/descargables/combos, sin romper las rutas existentes.

## Referencias
- `lib/products.ts` (`Category`) — hoy solo `"curso" | "descargable" | "combo"`, sin `"evento"`.
- `CDVP_Api/supabase/migrations/20260801000002_catalog.sql` y `.../20260810000001_remove_programa_category.sql` — `products.category` ya acepta `'evento'` en la base real.
- `CDVP_Api/app/services/pricing_service.py` (`DISCOUNT_BY_ITEM_TYPE`) — ya calcula 10% para `evento`, backend listo, solo falta exponerlo en el frontend.
- `TODO.md`, gap detectado 2026-07-31 ("categoría evento existe en la migración... pero no está en `CDVP_WEB/lib/products.ts`").
