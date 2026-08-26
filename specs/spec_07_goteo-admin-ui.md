---
numero: 07
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-08-26
depende_de: [goteo-admin-ui, goteo-contenido]
complejidad_cafes: 1
---

# Formulario de admin para cargar un ejercicio (Título, contenido, link de video)

**Dado** un admin en la pestaña de goteo (`/admin/goteo`, visible solo para admins)
**Cuando** carga o edita un ejercicio del banco
**Entonces** completa un formulario de 3 campos — Título, Contenido, Link de video — y el video puede ser de Vimeo o de YouTube, sin tener que elegir el proveedor a mano.

## Casos
- Pestaña/formulario no visible sin sesión de admin — mismo guard que el resto de `/admin/*` (`components/auth-guard.tsx`, `role="admin"`).
- Los 3 campos son obligatorios; el link de video se valida como Vimeo o YouTube antes de guardar (mismo criterio de dominio que `spec_07_goteo-contenido.md` de `CDVP_Api`), si no es ninguno de los dos se muestra un error y no se guarda.
- Guardar llama a `PUT /admin/goteo/{numero_capsula}` (`spec_04_goteo-contenido.md`/`spec_07_goteo-contenido.md`, `CDVP_Api`) con los 3 campos del ejercicio.
- Falla el guardado (backend caído, validación rechazada) → mensaje de error visible, el admin no pierde lo ya tipeado en el formulario.
- Editar un ejercicio existente precarga los 3 campos con sus valores actuales.

## Referencias
- `spec_03_goteo-admin-ui.md`: vista de navegación de cápsulas que este formulario completa (hoy solo decía "admin edita la lista de ejercicios", sin detallar los campos).
- `spec_07_goteo-contenido.md` (`CDVP_Api`): endpoint y forma de los 3 campos que este formulario consume.
- `components/auth-guard.tsx`: guard de sesión/rol ya extraído, reusado acá tal cual.
