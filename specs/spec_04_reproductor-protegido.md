---
numero: 04
estado: propuesto # implementado | en_progreso | propuesto
fecha: null
depende_de: [contenido-video-vimeo]
complejidad_cafes: 1
---

# Reproductor de video de curso (Vimeo) y visor de PDF, sin descarga

**Dado** un usuario con acceso vigente a un curso que tiene video y/o material en PDF
**Cuando** entra al detalle del producto (`/producto/[slug]`)
**Entonces** ve el video embebido de Vimeo (sin botón de descarga, dominio restringido a `clubdevoleyplaya.com`) y el PDF en un visor sin link de descarga directo.

## Casos
- Usuario con acceso vigente, producto con `vimeo_video_id` cargado → se embebe el player de Vimeo con ese ID.
- Usuario con acceso vigente, producto sin video todavía (`vimeo_video_id` null) → muestra "video próximamente", no rompe la página.
- Usuario sin acceso vigente → no se renderiza el player ni se pide el ID al backend (el backend ya lo bloquea en `spec_05_contenido-video-vimeo.md`, pero el frontend tampoco debe intentar mostrar un placeholder que insinúe el video).
- PDF de material del curso → se muestra en visor embebido (Drive o `@react-pdf-viewer`), sin botón ni link que permita bajar el archivo original.
- El embed de Vimeo probado desde un origen distinto de `clubdevoleyplaya.com` (ej. `localhost` en producción, o un dominio ajeno) → rechazado por la restricción configurada en el dashboard de Vimeo, no por código de este repo.
- Reemplaza el patrón anterior de embed de YouTube para video de curso — YouTube sigue existiendo en el repo, pero solo dentro de `testimonios-landing`, no en este componente.

## Referencias
- `spec_05_contenido-video-vimeo.md` (`CDVP_Api`): expone el `vimeo_video_id` solo a usuarios con acceso.
- `context/NOMENCLATURA_SPECS.md`, fila `reproductor-protegido`.
- `templates/checklist_owasp.md`, fila `CDVP-01` (control de anti-descarga, criterio de verificación del domain-restriction).
- `TODO.md`, sección "Fase 3 — Frontend" (reproductor embebido) y bloque de decisiones (Vimeo, 2026-08-26).
