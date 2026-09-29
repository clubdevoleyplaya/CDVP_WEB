---
numero: 19
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-30
depende_de: [checkout-ui]
complejidad_cafes: 1
---

# El carrito también paga: "Ir a pagar" lleva al pago real

**Dado** una persona con productos en el carrito
**Cuando** toca "Ir a pagar"
**Entonces** se crea la orden con todo lo del carrito y se la lleva al pago de MercadoPago (pesos) o Paddle (dólares), igual que con el botón "Comprar" de la ficha.

## Casos
- Con sesión iniciada y productos en el carrito → crea una sola orden con todos los productos y la redirige al link de pago.
- Sin sesión iniciada → la lleva a iniciar sesión, sin perder lo que puso en el carrito.
- Mientras se prepara el pago el botón dice "Redirigiendo..." y no se puede tocar de nuevo.
- Si el servidor rechaza la compra o no responde, se muestra un mensaje claro dentro del carrito y el botón queda libre para reintentar; nunca queda un botón que no hace nada.
- Si ya tiene alguno de esos productos, se le avisa que revise su perfil en vez de cobrarle de nuevo.
- Con el carrito vacío el botón sigue deshabilitado.
- El texto "Demo — no procesa ningún pago real" desaparece.

## Referencias
- Bug detectado probando en local (2026-09-30): "Ir a pagar" no hacía nada; `components/cart-drawer.tsx` no tenía acción en ese botón.
- `components/product-buy-box.tsx::handleBuy` — el flujo real que se replica para varios productos.
- `spec_05_checkout-ui.md` y `spec_03_checkout.md` (CDVP_Api) — contrato de `POST /checkout`, que ya acepta una lista de productos.
