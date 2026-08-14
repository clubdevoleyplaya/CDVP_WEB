---
numero: 02
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-08-13
depende_de: []
complejidad_cafes: 1
---

# Página de Política de Privacidad

**Dado** que CDVP guarda datos personales (nombre, mail) y usa servicios de terceros (Supabase, Mercado Pago, YouTube) que también procesan datos del usuario
**Cuando** un usuario quiere saber qué datos se recolectan o pedir que se los borren
**Entonces** existe una página pública en `/privacidad` que lo explica en lenguaje simple, con un canal de contacto para pedir la baja.

## Casos
- Página `/privacidad` accesible sin login, linkeada desde el footer.
- Declara qué datos se guardan (nombre, mail, historial de compras) y con qué fin (dar acceso a los cursos comprados).
- Declara los terceros reales que procesan datos: Supabase (autenticación y base de datos), Mercado Pago (pagos), YouTube (videos embebidos, puede registrar IP del visitante).
- No usa AI en ningún flujo de producto — no aplica declarar su uso (confirmado por auditoría 2026-08-13, sin `langchain`/`openai` en `app/`).
- Solicitud de baja/eliminación de cuenta: no hay endpoint de autoservicio todavía (no hace falta programarlo para este spec), la página deja un mail de contacto para pedirla a mano — mismo criterio que otros procesos manuales del proyecto (ej. migración de usuarios legado).
- Texto es un borrador razonable, no reemplaza una revisión legal antes de un lanzamiento formal — se deja anotado en el propio texto de la página.

## Referencias
- `CDVP_WEB/docs/seguridad/auditoria_2026-08-13.md`, sección "Checklist externo" (gaps #1/#2/#4/#5).
- `TODO.md`, pregunta abierta #10.
- `context/NOMENCLATURA_SPECS.md`, fila `privacidad-datos`.
