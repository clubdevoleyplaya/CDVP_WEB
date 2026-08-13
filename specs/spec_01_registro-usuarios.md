---
numero: 01
estado: propuesto # implementado | en_progreso | propuesto
fecha: null
depende_de: [migracion-usuarios-legado]
complejidad_cafes: 1
---

# Registro de cuenta, con reclamo automático para compradores de Hotmart

**Dado** que una persona todavía no tiene cuenta en CDVP, sea nueva o compradora histórica de Hotmart
**Cuando** completa el formulario de registro (Supabase Auth)
**Entonces** su cuenta queda creada y, si su email coincide con una compra vieja, ya ve sus cursos disponibles sin pagar de nuevo.

## Casos
- Registro exitoso con email que coincide con una compra legado → después de confirmar el mail, `/perfil` ya muestra esos cursos como comprados, sin pasar por checkout.
- Registro exitoso sin coincidencia con Hotmart → flujo normal, sin cursos previos.
- Registro con email ya usado en Supabase Auth → error estándar de Supabase ("ya existe una cuenta"), sin mención especial a Hotmart.
- Mientras el mail de confirmación no se valida → no se otorgan los accesos legado todavía, aunque haya coincidencia (mismo criterio que cualquier alta: cuenta no confirmada no tiene acceso a contenido pago).
- Sin aviso especial de "detectamos que compraste antes" en el formulario de registro — el reclamo es automático y silencioso, se nota porque el curso ya aparece disponible en `/perfil`, no porque el formulario lo anuncie. (Si Juli quiere un mensaje explícito tipo "recuperamos tu compra anterior", queda para una iteración futura, no bloquea este spec.)

## Referencias
- `spec_02_migracion-usuarios-legado.md` (`CDVP_Api`): la reasignación de accesos pendientes por email ocurre en el backend al crearse `profiles`, este spec solo cubre que el frontend no necesita pantalla nueva para ese caso.
- `context/NOMENCLATURA_SPECS.md`, fila `registro-usuarios`.
