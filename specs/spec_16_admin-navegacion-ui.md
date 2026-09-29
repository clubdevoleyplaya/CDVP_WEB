---
numero: 16
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-29
depende_de: [goteo-admin-ui, descuentos-admin-ui]
complejidad_cafes: 1
---

# Moverse entre las pantallas de administración sin volver a escribir la dirección

**Dado** una administradora dentro de cualquier pantalla de `/admin`
**Cuando** quiere ir a otra sección del panel (por ejemplo, del panel general a Descuentos y de vuelta)
**Entonces** ve arriba una barra con todas las secciones, la actual resaltada, y llega a cualquiera con un solo clic.

## Casos
- La barra aparece en las 4 pantallas: Panel general, Goteo, Cuestionarios y Descuentos, siempre con las mismas opciones y en el mismo orden.
- La sección donde está parada la persona se ve resaltada, para que sepa dónde está.
- Entrar a `/admin` a secas lleva al Panel general, en vez de mostrar una página inexistente.
- Los enlaces sueltos que había entre pantallas (por ejemplo "Goteo de contenido" en el panel general) se reemplazan por esta barra, para que haya un único lugar donde navegar.
- En celular la barra se puede deslizar hacia los costados, sin romper el ancho de la pantalla.
- Quien no es administradora sigue sin ver nada de esto: la protección de `/admin` no cambia.

## Referencias
- `app/admin/analytics/page.tsx` — panel general, con enlaces sueltos a Goteo y Descuentos que hoy hacen de navegación.
- `app/admin/goteo/page.tsx`, `app/admin/cuestionarios/page.tsx`, `app/admin/descuentos/page.tsx` — las otras pantallas, hoy sin forma de volver.
- `proxy.ts` — protección de `/admin` por rol, que no se toca.
- Pedido de Julián (2026-09-29): "la ventana de descuentos no tiene un selector para volver a la otra vista de admin".
