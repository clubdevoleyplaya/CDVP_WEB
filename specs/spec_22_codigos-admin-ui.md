---
numero: 22
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-30
depende_de: [codigos-promocionales, admin-navegacion-ui]
complejidad_cafes: 1
---

# Pantalla de códigos promocionales para Juli

**Dado** la administradora dentro de `/admin/codigos`
**Cuando** completa el formulario y guarda
**Entonces** el código queda creado y aparece en la lista con sus usos, y puede apagarlo o encenderlo desde ahí.

## Casos
- El formulario pide código, porcentaje, categorías donde vale (ninguna marcada = todas), fecha de inicio, fecha de fin y usos máximos (vacío = sin límite).
- Sin código o con un porcentaje vacío, fuera de 0 a 100 o que no es un número, no permite guardar.
- Al guardar aparece un aviso y el código nuevo se suma a la lista; si el código ya existe o el servidor rechaza un dato, se explica con palabras simples.
- La lista muestra cada código con porcentaje, categorías, vigencia y "usos: 3 de 50" (o "usos: 3" si no hay límite).
- Cada código tiene un botón para apagarlo o encenderlo, con su aviso de "guardado".
- Mientras carga la lista hay un esqueleto, y si falla, un mensaje de error en vez de una pantalla en blanco.
- Quien no es administradora no ve la pantalla, igual que goteo, cuestionarios y descuentos.
- "Códigos" aparece en el menú del admin junto a las demás pantallas.

## Referencias
- `spec_22_codigos-promocionales.md` (CDVP_Api) — `GET/POST/PATCH /admin/codigos`.
- `spec_14_descuentos-admin-ui.md` y `components/discount-rules-editor.tsx` — mismo patrón de pantalla.
- `lib/admin-sections.ts` — menú del admin.
