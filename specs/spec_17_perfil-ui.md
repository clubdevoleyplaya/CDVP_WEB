---
numero: 17
estado: implementado # implementado | en_progreso | propuesto
fecha: 2026-09-29
depende_de: [perfil-ui, perfil]
complejidad_cafes: 1
---

# Perfil: cada persona pone su propia foto de banner

**Dado** una persona con sesión iniciada dentro de su perfil
**Cuando** sube una foto como banner
**Entonces** el banner de colores de CDVP se reemplaza por su foto, y la ve así cada vez que entra.

## Casos
- Sin banner propio se ve el banner de colores de CDVP, con el botón "Subir banner".
- Al elegir una imagen, el banner cambia en la misma página sin recargar, y el botón pasa a decir "Cambiar banner".
- Con banner propio aparece una "x" para quitarlo y volver al banner de colores de CDVP.
- Si el archivo no es una imagen, se avisa con palabras simples y no se sube nada.
- Si la imagen pesa más de 5 MB, se avisa que elija una más liviana y no se sube.
- Si la subida falla (sin conexión, servidor caído), aparece un mensaje de error y el banner anterior se mantiene.
- Mientras se sube, el botón muestra "Subiendo..." y no permite elegir otra imagen.

## Referencias
- `spec_19_perfil.md` (CDVP_Api) — guarda `banner_url` en el perfil y crea el almacenamiento `banners`.
- `app/perfil/page.tsx` — mismo mecanismo que la foto de perfil (`handleAvatarUpload`).
- `context/demo-state.tsx` — `updateProfile` con `bannerUrl`.
- `TODO.md`: "Banner de CDVP en perfiles (pedido de Bastian, dev)".
