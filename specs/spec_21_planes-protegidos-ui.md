---
numero: 21
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-30
depende_de: [planes-protegidos, paginas-paddle]
complejidad_cafes: 1
---

# Ver un plan de entrenamiento en la web, sin archivo para bajar

**Dado** una persona con acceso a un plan de entrenamiento que entra a `/planes/[slug]`
**Cuando** acepta la cláusula de exención de responsabilidad
**Entonces** ve el plan en tablas dentro de la página, sin botón ni enlace de descarga.

## Casos
- Primera vez: antes de ver el plan se muestra la cláusula completa con un botón "Acepto"; al aceptar, el plan aparece sin recargar.
- Quien ya aceptó esa versión del texto entra directo al plan.
- Plan que todavía no está cargado: se ve "próximamente", sin pedir la cláusula.
- Sin acceso al plan (sin suscripción ni compra): mensaje claro con enlace a la membresía, sin mostrar contenido.
- Si alcanzó el tope de planes distintos por día, se le avisa que vuelva más tarde.
- Sin sesión iniciada: pide iniciar sesión, igual que el resto de la plataforma.
- Si el servidor no responde, mensaje de error y botón para reintentar, nunca una pantalla en blanco.
- La página no ofrece descargar ni copiar un archivo; es una limitación conocida que una captura de pantalla sigue siendo posible.

## Referencias
- `spec_20_planes-protegidos.md` (CDVP_Api) — `GET /planes/{slug}`, `GET/POST /planes/clausula`.
- Mensaje de Juli (2026-09-29): planes sin descarga, cláusula al abrir por primera vez, tope de 3 por día.
- `components/clausula-exencion.tsx` — texto de la cláusula, compartido con `/condicionesservicio`.
- `components/auth-guard.tsx` — control de sesión reutilizado.
