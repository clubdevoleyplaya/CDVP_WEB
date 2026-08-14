---
numero: 00
estado: en_progreso # implementado | en_progreso | propuesto
fecha: 2026-08-13
depende_de: []
complejidad_cafes: 1
---

# Organización de testimonios en el landing

**Dado** que el club tiene testimonios de tres orígenes distintos (video de Campus, video de Campamento, texto por curso asincrónico)
**Cuando** se arma la sección de testimonios del landing
**Entonces** se agrupan según su alcance real en vez de mostrarse todos mezclados en un bloque genérico único.

## Casos
- Testimonios en video de Campus (11 Shorts de YouTube, IDs pasados por Juli 2026-08-13, sedes Phoenix/Santiago/Guanaqueros) → se muestran mezclados sin restricción ni distinción de sede, es el volumen más alto y es contenido general del club.
- Testimonios en video de Campamento de entrenamiento (2 Shorts de YouTube, IDs pasados por Juli 2026-08-13) → se muestran solo dentro de la sección propia de Campamento, nunca mezclados con los de Campus.
- Sección propia de Campamento → implementada como bloque separado dentro del mismo landing (no ruta propia), asumido por no haber indicación contraria y porque todo este pedido se acotó al landing. Confirmar con el usuario si prefiere ruta propia (ej. `/campamento`).
- Testimonios en texto (hoy 4, genéricos en `TESTIMONIALS` de `testimonials.tsx`) → cada uno se reasigna al curso asincrónico que corresponde según el contenido de la cita (ej. la cita que menciona "ataque, recepción y armado" va con esos cursos), y se muestra en el contexto de ese curso, no como bloque genérico del landing.
- Testimonio en texto sin curso identificable con certeza en el contenido de la cita → queda sin asignar hasta que Juli lo confirme, no se inventa el curso.
- Testimonios de 1:1 Beach Volley Lab (carpeta Drive `1BoxkAtujpmJEUSA7mfhdsLLFErZassHj`) → fuera de alcance de este spec, se mantienen como están hoy.

## Referencias
- `components/testimonials.tsx`
- `TODO.md`, sección Fase 3, pedido de Juli 2026-08-10 sobre testimonios en video.
