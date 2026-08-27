---
numero: 09
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-08-26
depende_de: [goteo-admin-ui, goteo-contenido]
complejidad_cafes: 1
---

# Editor de goteo: campo de PDF y galería de fotos

**Dado** el editor de ejercicios de una cápsula de goteo (título, contenido, link de video)
**Cuando** el admin edita un ejercicio
**Entonces** puede agregar, opcionalmente, un link de PDF (un campo de texto, igual que el de video) y una lista de links de fotos (agregar/quitar filas dinámicamente), y guardarlos junto con el resto del ejercicio.

## Casos
- El formulario muestra un input de "Link de PDF" opcional, sin validación de dominio (a diferencia del de video).
- El formulario permite agregar N filas de "Link de foto" con un botón "Agregar foto" y cada fila tiene su botón para quitarla.
- Ejercicio existente sin PDF ni fotos se edita sin romper (campos vacíos por defecto, no `undefined`).
- Al guardar, `pdf_url` y `photo_urls` se mandan al `PUT /admin/goteo/{n}` junto con `title`/`content`/`video_url`.
- La lista de ejercicios de la cápsula sigue mostrando solo título/proveedor de video (sin inflar la card con la galería completa).
- Al lado del formulario (título/contenido/video/PDF/fotos) se muestra en vivo un visualizador de cómo queda el ejercicio para el suscriptor: video embebido (Vimeo o YouTube), título, contenido, botón de PDF si hay link, y grilla de fotos si hay alguna cargada. Se actualiza en cada tecla, sin guardar.

## Referencias
- `components/exercise-form.tsx` — formulario a extender (mismo patrón de `Input`/`Label` que ya usa para título/video).
- `components/exercise-preview.tsx` — visualizador en vivo, reusa `VimeoPlayer` y `detectVideoProvider`.
- `components/goteo-capsule-editor.tsx` — wiring de carga/guardado a extender (`ExerciseFormValues`, payload del `PUT`).
- `spec_09_goteo-contenido.md` (CDVP_Api) — contrato de los campos nuevos que este spec consume.
