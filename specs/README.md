# Specs atómicos — convención

Cada regla/feature de `CDVP_WEB` (UI, contenido, flujos de usuario) se documenta acá antes de programarse, como un spec chico e independiente. Mismo formato que `CDVP_Api/specs/README.md` — un solo estándar para los dos repos.

> Convención respaldada por el harness en la raíz de `CDVP/` (vendorizado y adaptado de `IAMIN/COMMON_PROJECT_LLM_BLUEPRINTS`) — ver `../../scripts/agents/GENERAR_SPEC.md` para generar un spec nuevo y `../../scripts/agents/tools/validate_specs.py` para validarlo. El vocabulario de componentes válidos vive en `../../context/NOMENCLATURA_SPECS.md`, fuente única.

## Tamaño: 1 café

Un spec se lee y se entiende completo en lo que dura un café (5-10 minutos, ~1300 palabras). Si no entra en eso (`complejidad_cafes` calculado > 2), se parte en dos specs.

## Formato

```markdown
---
numero: NN
estado: propuesto # implementado | en_progreso | propuesto
fecha: null
depende_de: []
complejidad_cafes: null
---

# <Nombre de la regla, en lenguaje simple>

**Dado** <la situación de partida>
**Cuando** <lo que pasa>
**Entonces** <lo que tiene que ocurrir>

## Casos
- <caso 1, en una línea> (máximo 8)

## Referencias
- <al menos una cita verificable>
```

Sin jerga técnica: se escribe como se le explicaría a Juli.

## Flujo de trabajo

1. Se escribe el spec (`estado: propuesto`) — a mano, o con "genera el spec de `<feature>`" (`../../scripts/agents/GENERAR_SPEC.md`).
2. Se corre `python3 ../../scripts/agents/tools/validate_specs.py . --repo CDVP_WEB` — debe terminar en `PASA` antes de programar.
3. Se implementa el componente/página descrito, verificado visualmente en navegador (no solo tipos/lint).
4. El spec pasa a `estado: en_progreso` → `implementado`.

## Specs existentes

- [`spec_00_testimonios-landing.md`](./spec_00_testimonios-landing.md) [implementado] — testimonios de video (Campus mezclado, Campamento en sección propia) y de texto (por curso, en `/producto/[slug]` y en el landing) implementados.
- [`spec_01_registro-usuarios.md`](./spec_01_registro-usuarios.md) [propuesto]
- [`spec_02_privacidad-datos.md`](./spec_02_privacidad-datos.md) [implementado] — página `/privacidad`, borrador pendiente de revisión legal.
- [`spec_03_goteo-admin-ui.md`](./spec_03_goteo-admin-ui.md) [implementado] — `/admin/goteo`, navegación 1↔12 sin recargar, edita ejercicios de una cápsula.
- [`spec_04_reproductor-protegido.md`](./spec_04_reproductor-protegido.md) [en_progreso] — player de Vimeo real hecho; visor de PDF pendiente, no hay ningún campo/URL de material real en el sistema todavía.
- [`spec_05_checkout-ui.md`](./spec_05_checkout-ui.md) [implementado] — botón "Comprar" llama a `POST /checkout` real y redirige al `init_point` de MercadoPago; USD/Paddle aún no soportado.
- [`spec_06_checkout-ui.md`](./spec_06_checkout-ui.md) [implementado] — página `/suscripcion` real: detalle público, "Suscribirme" crea preapproval real y redirige, ya-suscripto lo indica en vez de ofrecer suscribirse de nuevo.
- [`spec_07_goteo-admin-ui.md`](./spec_07_goteo-admin-ui.md) [implementado] — formulario de admin: título, contenido, link de video (detecta Vimeo/YouTube solo)
- [`spec_08_perfil-ui.md`](./spec_08_perfil-ui.md) [implementado] — sección "Suscripción" en `/perfil`, botón "Cancelar suscripción" con confirmación, actualiza en la misma página sin recargar.
