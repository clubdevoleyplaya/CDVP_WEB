---
numero: 12
estado: propuesto
fecha: null
depende_de: []
complejidad_cafes: 1
---

# Preguntas después del video del curso, en la misma pantalla

**Dado** un usuario con acceso vigente a un curso que tiene cuestionario cargado
**Cuando** termina de ver el video en `/producto/[slug]`
**Entonces** ve las preguntas del cuestionario debajo del video y puede responderlas ahí mismo, sin salir de la página.

## Casos
- Curso con preguntas cargadas y usuario con acceso vigente → aparece el bloque de cuestionario debajo del reproductor de Vimeo, con las preguntas en orden.
- Usuario responde una pregunta → se guarda contra el backend; si recarga la página, ve su respuesta ya cargada, no un formulario en blanco.
- Curso sin cuestionario cargado → no se muestra el bloque, el detalle del producto se ve igual que hoy.
- Usuario sin acceso vigente al curso → no se pide ni se muestra ninguna pregunta (el backend ya lo bloquea, el frontend tampoco insinúa que existen).
- Falla el guardado de una respuesta (error de red) → se avisa con un mensaje claro, la respuesta no se pierde silenciosamente ni queda un estado ambiguo.

## Referencias
- `app/producto/[slug]/page.tsx`, `components/product-video-section.tsx` — pantalla donde ya se embebe el video de Vimeo, lugar natural para sumar el bloque de cuestionario.
- `CDVP_Api/specs/spec_12_cuestionarios.md` — backend que este bloque consume (`GET`/guardado de respuestas).
- `TODO.md`, sección "Fase 3 — Frontend": "UI de cuestionarios por video: mostrar preguntas tras el video, guardar respuestas del alumno."
- `context/NOMENCLATURA_SPECS.md`, fila `cuestionarios-ui`.
