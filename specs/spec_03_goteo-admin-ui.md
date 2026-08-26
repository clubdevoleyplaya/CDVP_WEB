---
numero: 03
estado: propuesto # implementado | en_progreso | propuesto
fecha: null
depende_de: [goteo-contenido]
complejidad_cafes: 1
---

# Vista de admin para navegar y editar el goteo de ejercicios

**Dado** un admin logueado en `/admin/goteo`
**Cuando** entra a la vista
**Entonces** puede navegar las 12 cápsulas del banco de ejercicios (1↔12, no solo la del mes actual de un usuario puntual) y editar qué ejercicios entran en cada una.

## Casos
- Admin sin sesión o con `profiles.role != admin` → mismo guard que `/admin/analytics` (protegido server-side por `proxy.ts`, más el guard de cliente vía `useDemoState()`), redirige a `/login` o muestra "sin acceso".
- Vista muestra la cápsula actual con sus 20 ejercicios, y botones "anterior"/"siguiente" para navegar 1↔12 sin recargar la página.
- Admin edita la lista de ejercicios de una cápsula (agrega/saca un ejercicio del banco de 120) → se guarda contra `PUT /admin/goteo/{numero_capsula}` (`goteo-contenido`, `CDVP_Api`).
- Vista es de **previsualización**, no de simulación por usuario individual — muestra el contenido de la cápsula N, no "qué ve el usuario X hoy" (eso se puede sumar después si Juli lo pide, no bloquea este spec).
- Cambios guardados se reflejan de inmediato al volver a esa cápsula (sin caché stale).

## Referencias
- `spec_04_goteo-contenido.md` (`CDVP_Api`): expone los endpoints `GET`/`PUT /admin/goteo/{numero_capsula}` que esta vista consume.
- `app/admin/analytics/page.tsx`: mismo patrón de guard (`useDemoState()` + `session`/`me.role`) reusado acá.
- `context/NOMENCLATURA_SPECS.md`, fila `goteo-admin-ui`.
- `TODO.md`, pregunta abierta #1 (resuelta 2026-08-26).
