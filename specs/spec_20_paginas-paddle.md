---
numero: 20
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-30
depende_de: [privacidad-datos, checkout-ui]
complejidad_cafes: 1
---

# Páginas públicas para Paddle y página donde se abre el pago en dólares

**Dado** que Paddle revisa el sitio antes de aprobar la cuenta de cobros en dólares
**Cuando** la revisión entra a la web
**Entonces** encuentra sin iniciar sesión los precios, las condiciones de servicio, la política de reembolso y la política de privacidad, y la compra en dólares se completa en una página propia del sitio.

## Casos
- `/pricing` muestra todos los productos con su precio en dólares y la membresía en USD 9 al mes (USD 15 tachado), sin pedir sesión.
- `/condicionesservicio` incluye la cláusula de exención de responsabilidad completa que entregó Juli (titular Julian Azaad, nombre comercial Club de Voley Playa).
- `/politicareembolso` explica cómo pedir un reembolso; mientras Juli no confirme el plazo, el texto dice que es un borrador.
- `/privacidad` ya existía y sigue igual.
- Las cuatro páginas están enlazadas desde el pie de todas las pantallas.
- `/pagar` abre el pago de Paddle cuando llega con el código de la transacción; sin ese código muestra un mensaje claro en vez de una pantalla en blanco.
- Si falta configurar el token de Paddle, `/pagar` lo avisa con palabras simples y no rompe la página.

## Referencias
- Mensaje de Juli (2026-09-30): "me falta el dominio web de checkout, ¿qué link debería poner ahí?" y texto de la cláusula de exención.
- Pedido del usuario (2026-09-30): generar las rutas `condicionesservicio`, `privacidad`, `politicareembolso` y `pricing` para Paddle.
- `app/privacidad/page.tsx` — estructura y estilo que reutilizan las páginas nuevas.
- `lib/products.ts` — precios en dólares que lee `/pricing`.
- `components/footer.tsx` — donde se agregan los enlaces.
- `CDVP_Api/app/services/paddle_service.py` — crea la transacción cuyo código llega a `/pagar`.
