---
numero: 13
estado: implementado
fecha: 2026-08-28
depende_de: [cuestionarios-admin-ui]
complejidad_cafes: 1
---

# Panel de admin para armar el cuestionario de un curso

**Dado** un admin logueado en la vista de cuestionarios de un curso
**Cuando** entra a esa vista
**Entonces** puede crear el cuestionario (si el curso no tiene uno) y agregar, editar, borrar y reordenar sus preguntas, igual que hoy edita el goteo.

## Casos
- Admin sin sesión o con `profiles.role != admin` → mismo guard que `/admin/goteo` (protegido server-side, redirige a `/login` o muestra "sin acceso").
- Curso sin cuestionario → se muestra un formulario simple para crear uno (solo título), antes de poder agregar preguntas.
- Curso con cuestionario → lista editable de preguntas, cada una con su texto y un botón para borrarla.
- Botón "agregar pregunta" suma una fila nueva vacía a la lista, sin perder las que ya estaban.
- Botones subir/bajar por fila reordenan las preguntas y persisten el nuevo `order_index` contra `PUT /admin/cuestionarios/{quiz_id}/orden`.
- Cambios guardados se reflejan de inmediato al recargar la vista (sin caché stale), mismo criterio que `spec_03_goteo-admin-ui.md`.

## Referencias
- `spec_14_cuestionarios.md` (`CDVP_Api`) — expone los endpoints `POST`/`PUT`/`DELETE` que esta vista consume.
- `spec_03_goteo-admin-ui.md` — precedente directo: mismo patrón de guard y de vista de admin para editar contenido.
- `app/admin/analytics/page.tsx` — mismo guard (`useDemoState()` + `session`/`me.role`) reusado acá.
- `context/NOMENCLATURA_SPECS.md`, fila `cuestionarios-admin-ui`.
