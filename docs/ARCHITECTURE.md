# Arquitectura y Visión General del Proyecto

## 1. Topología de Repositorios
- **Backend Repo (`CDVP_Api`):** FastAPI + Supabase + Railway. Control de pagos (Paddle/Payoneer y MercadoPago/Bancos Argentina), consumo de Google Drive API y YouTube API.
- **Frontend Repo (`CDVP_WEB`):** Interfaz moderna basada en la web original de referencia, conectada al backend por REST API.

## 2. Reglas del Modelo de Negocio
1. **Welcome Pack:**
   - Se activa únicamente con la suscripción mensual activa.
   - Si la suscripción expira o se cancela, el usuario pierde el acceso al Welcome Pack inmediatamente.
2. **Beneficio del 20% OFF:**
   - 20% de descuento automático en Cursos y Eventos para miembros con suscripción activa.
3. **Procesamiento de Pagos Global + Argentina:**
   - Pagos globales: Paddle como Merchant of Record (USD), con liquidación hacia los datos bancarios entregados por Payoneer.
   - Pagos Argentina: MercadoPago (ARS), checkout de invitado sin login forzado.

## 3. Arquitectura Frontend

### 3.1 Stack Tecnológico y Principios
- **Framework:** Next.js (App Router) o React + Vite con TypeScript estricto.
- **Estilos:** Tailwind CSS (fiel a la línea gráfica de la página web base del cliente).
- **Estado & Auth:** Supabase Auth Client + TanStack Query (React Query) para consumir FastAPI.
- **Despliegue:** Railway o Vercel.

### 3.2 Componentes Clave e Integraciones

**A. Reproductor de Cursos (YouTube Integrado)**
- Reproductor incrustado de YouTube configurado de forma segura (`modestbranding=1`, `rel=0`).
- Consumir el listado de videos y progreso desde el backend en FastAPI.

**B. Visor de PDFs y Material del Curso**
- Renderizar PDFs utilizando visores seguros (ej. `@react-pdf-viewer/core` o embebidos protegidos de Google Drive).
- Deshabilitar/dificultar botones de descarga directa sobre el material exclusivo o el Welcome Pack.

**C. Flujo de Suscripción y Descuentos Dinámicos**
- **Estado de Suscripción:** Mostrar el estado actual en el perfil (`Activa`, `Expirada`, `Cancelar`).
- **Vista de Cursos y Eventos:**
  - Usuarios no suscriptores: Muestra el precio base y un banner promocional *"Suscríbete y obtén 20% OFF en este curso"*.
  - Usuarios suscriptores: Muestra el precio con tachado `~~$100~~ $80 (20% OFF aplicado)`.
- **Acceso al Welcome Pack:** UI con bloqueo visual/overlay si la suscripción no está activa.

### 3.3 Normas de Comunicación con Backend
- Nunca calcular descuentos o montos finales en el cliente. Solicitar siempre al backend el checkout session / preferencia de pago.
- Enviar el JWT de la sesión de Supabase en el header `Authorization: Bearer <token>` en todas las llamadas a la API.

### 3.4 Instrucciones de Desarrollo
- Preservar la estructura visual y de contenidos de la web base original.
- Implementar estados de carga (`skeleton loaders`) y manejo explícito de errores de la API.
