---
numero: 10
estado: en_progreso # implementado | en_progreso | propuesto
fecha: 2026-08-27
depende_de: []
complejidad_cafes: 1
---

# Recuperar contraseña con un mail que se vea de CDVP, no genérico

**Dado** que una persona con cuenta en CDVP olvidó su contraseña
**Cuando** pide recuperarla desde "Olvidé mi contraseña" con su email
**Entonces** recibe un mail con la marca de CDVP (no la plantilla gris de Supabase) con un link que la lleva directo a elegir una contraseña nueva, y ese link funciona la primera vez que lo usa.

## Casos
- Pide recuperación con un email que tiene cuenta → recibe, en minutos, un mail con logo/colores de CDVP (no la plantilla default de Supabase) con un botón para elegir nueva contraseña.
- Pide recuperación con un email que no tiene cuenta en CDVP → ve el mismo mensaje de "revisá tu email" que si sí existiera (no se revela si la cuenta existe), y no se manda ningún mail.
- Toca el botón del mail → entra directo a la pantalla de elegir nueva contraseña, sin pasar por login ni pedir la contraseña vieja.
- El link ya fue usado o pasaron más de 24 horas → mensaje claro de "este link venció, pedí uno nuevo", no una pantalla en blanco ni un error técnico. (Bug reportado por Juli: hoy el link no funciona y no queda claro por qué.)
- Guarda la contraseña nueva correctamente → queda con la sesión iniciada y puede seguir navegando CDVP sin loguearse de nuevo.
- El link funciona igual estando en el sitio de pruebas que en el sitio real (clubdevoleyplayaweb.up.railway.app) — no depende de en qué ambiente se pidió la recuperación.

## Referencias
- `CDVP_WEB/app/forgot-password/page.tsx` — pantalla donde se pide el mail de recuperación.
- `CDVP_WEB/app/auth/confirm/route.ts` — donde se valida el link que llega por mail.
- `CDVP_WEB/app/reset-password/page.tsx` — pantalla donde se elige la contraseña nueva.
- Reporte de Juli: el link de recuperación no le funcionó (2026-08-27).
