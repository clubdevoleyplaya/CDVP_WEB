---
numero: 23
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-30
depende_de: [canje-codigo-descuento, checkout-ui]
complejidad_cafes: 1
---

# Escribir un código promocional en el carrito

**Dado** una persona con productos en el carrito
**Cuando** escribe un código promocional y toca "Ir a pagar"
**Entonces** el servidor aplica el descuento al cobrar, o le avisa con palabras simples por qué el código no sirve.

## Casos
- El carrito tiene un campo opcional "¿Tienes un código?"; vacío, todo funciona como hasta ahora.
- Con un código válido, el pago se crea con el descuento aplicado por el servidor.
- Con un código que no existe, vencido, apagado o agotado, el carrito muestra el mensaje del servidor y no redirige al pago.
- El total que se ve en el carrito es informativo: no calcula el código, el precio final lo decide el servidor, y un cartel lo aclara.
- El código se manda tal como se escribió; las mayúsculas no importan.

## Referencias
- `spec_17_canje-codigo-descuento.md` (CDVP_Api) — `POST /checkout` con `promo_code`.
- `spec_19_checkout-ui.md` — "Ir a pagar" del carrito, que este spec extiende.
- `components/cart-drawer.tsx`.
