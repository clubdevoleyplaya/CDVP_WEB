# Cómo agregar los registros DNS en GoDaddy

Esto es para que el mail de Club de Voley Playa se pueda mandar desde nuestro propio dominio (en vez del genérico de Supabase). Hay que agregar 3 registros en GoDaddy. Son solo copiar y pegar, no hay que entender qué significan.

## Antes de empezar

1. Entrá a [godaddy.com](https://godaddy.com) e iniciá sesión con la cuenta que tiene el dominio `clubdevoleyplaya.com`.
2. Arriba a la derecha, andá a **Mis productos**.
3. Buscá `clubdevoleyplaya.com` y hacé clic en **DNS** (a veces dice "Administrar DNS" o "Manage DNS").
4. Vas a ver una lista de registros existentes. No toques ni borres ninguno de los que ya están — solo vamos a **agregar** 3 nuevos.

Para cada uno de los 3 de abajo: tocá el botón **Agregar** (o **Add**), completá los campos exactamente como dice la tabla (sin espacios de más al principio o al final), y guardá.

---

## Registro 1 — DKIM

| Campo | Valor a poner |
|---|---|
| Tipo | `TXT` |
| Nombre / Host | `resend._domainkey.mail` |
| Valor | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmIMa/UgJRVT22ieWpQoPZTNgTUF/VNaVeL78PXL/Wow9Pd7YaYx+lXEbgcbFtybK0R6mvKBXn0LNnfuRgI+t3sTeTYo9ZQihNJwz9zizGgmy9s0Pm3/y+k03fD5e7nk2vFBf3bcdkesb79ZvPN9qRLdIrFNbGbbZK9mnX9evmYQIDAQAB` |
| TTL | Dejar el que viene por defecto (1 hora / Auto) |

---

## Registro 2 — SPF (parte 1, tipo MX)

| Campo | Valor a poner |
|---|---|
| Tipo | `MX` |
| Nombre / Host | `send.mail` |
| Valor / Apunta a | `feedback-smtp.us-east-1.amazonses.com` |
| Prioridad | `10` |
| TTL | Dejar el que viene por defecto |

---

## Registro 3 — SPF (parte 2, tipo TXT)

| Campo | Valor a poner |
|---|---|
| Tipo | `TXT` |
| Nombre / Host | `send.mail` |
| Valor | `v=spf1 include:amazonses.com ~all` |
| TTL | Dejar el que viene por defecto |

---

## Al terminar

Cuando los 3 estén guardados, avisar — falta un paso más (tocar "Verify DNS Records" en Resend) para confirmar que quedaron bien. Puede tardar desde minutos hasta un par de horas en aparecer como verificado, es normal.
