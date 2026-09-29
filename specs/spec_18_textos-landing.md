---
numero: 18
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-30
depende_de: [testimonios-landing]
complejidad_cafes: 1
---

# Textos del home tal como los dicta Juli

**Dado** una persona que entra al home
**Cuando** lee la frase principal y la presentación de Juli
**Entonces** ve los textos exactos que Juli pidió, con sus tres títulos profesionales y la especialización en psicología deportiva.

## Casos
- La frase "Hoy mismo podés empezar a convertirte en un atleta profesional de voley playa." se ve sin comillas.
- "¿Quién soy?" cuenta los tres hitos: el primer torneo a los 13 años, la selección argentina en 2011 y los Juegos Olímpicos de Tokio en 2021.
- Los textos de "¿Quién soy?" van sin comillas.
- Los títulos visibles son: Profesor de Educación Física, Licenciado en Actividad Física, Entrenador internacional FIVB nivel I y la especialización en psicología de alto rendimiento deportivo del Barça Innovation Hub.
- Las dos fotos existentes (primer torneo y Tokio) se mantienen junto a su texto.

## Referencias
- Google Doc de Juli "Proyecto web CDVP", sección "Correcciones web" (textos y títulos).
- `components/hero.tsx` y `components/bio.tsx`.
