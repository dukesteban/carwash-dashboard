# 📋 Plan de desarrollo — CarWash Dashboard + Bot

## 🔗 Recursos
- **Cloudflare Worker:** `carwash-jwt.dukesteban.workers.dev`
- **Dashboard:** `carwash-dashboard.vercel.app`
- **GitHub:** `dukesteban/carwash-dashboard`
- **n8n:** `primary-production-6a94c.up.railway.app`
- **Supabase:** `ycrhgxwnikksmwyofzmv.supabase.co`
- **Google Calendar:** `dukesteban@gmail.com`

---

## ✅ Completado

### Bot (n8n)
- [x] Selección de servicio desde DB
- [x] Verificación de superposición de turnos
- [x] Sugerencia de próximo horario disponible
- [x] Horarios de atención desde DB
- [x] Gestión de clientes con tabla `telefonos`
- [x] Escape global (cancelar / salir / 0)
- [x] Cancelar turno desde WhatsApp
- [x] Ver mis turnos desde WhatsApp
- [x] Mensaje de bienvenida con horarios desde DB

### Dashboard (Angular)
- [x] Vista de turnos con estadísticas
- [x] Agenda vista día y semana (con bloques por minuto)
- [x] Servicios CRUD con toggle activo
- [x] Clientes con historial de turnos y gestión de teléfonos
- [x] Configuración del negocio y horarios de atención
- [x] Navbar responsive (solo íconos en mobile)
- [x] Ganancias por día y mes con gráfico de barras
- [x] Estado "atendido" en vez de "confirmado"

---

## 🚧 Features pendientes

### Bot (n8n)
- [ ] Guardar `event_id` de Google Calendar en turnos
- [ ] Recordatorio automático 24hs antes del turno
- [ ] Recopilar nombre real del cliente (actualmente "Cliente N")
- [ ] Mensaje de bienvenida: si inicio y fin son el mismo día no repetir "de X a X"
- [ ] Flujo de reprogramar turno desde WhatsApp
- [ ] **Link "Agregar al calendario"** en mensaje de confirmación — link de Google Calendar con fecha, hora y servicio precargados, se arma en el mismo nodo Code que genera el mensaje de confirmación

### Dashboard (Angular)
- [ ] **Realtime** — Supabase realtime subscriptions (sin polling)
- [ ] **Nombre del negocio en navbar** — leer desde tabla `configuracion`
- [ ] **Tipografía** — cambiar fuente en toda la app
- [ ] **Editar/Postergar turno** — nueva fecha/hora desde dashboard, validar horario laboral, sin superposición, opción de cambiar servicio
- [ ] **Agregar turno manual** — desde dashboard con mismas validaciones que el bot (para clientes que vienen en persona)
- [ ] **Selector semana/mes** en lista de turnos del dashboard
- [ ] **Colores de estado:**
  - 🟡 Pendiente — turno futuro
  - 🟠 Vencido — turno pasado sin marcar (solo visual, no cambia DB)
  - 🟢 Atendido
  - 🔴 Cancelado
- [ ] **Job en n8n cada 15min** — detectar turnos pendientes vencidos y mostrarlos visualmente como vencidos en el dashboard (sin cambiar estado en DB)
- [ ] **Cancelar turno desde dashboard** + notificar cliente por WhatsApp
- [ ] **Botón limpiar turnos viejos** — eliminar turnos pasados en masa

### Seguridad
- [ ] **Login con usuario/contraseña** — usuario Admin, contraseña guardada en Supabase, opción de cambiarla desde Configuración
- [ ] **Login biométrico (WebAuthn)** — huella o cara del celular para desbloquear la PWA (alternativa premium al login clásico)

---

## 🐛 Correcciones pendientes

### Dashboard
- [ ] Deshabilitar zoom en PWA (`user-scalable=no` en el `<meta viewport>`)
- [ ] Nombre del cliente en Turnos no se actualiza al cambiarle el nombre desde Clientes
- [ ] Turnos cancelados y atendidos no deben mostrar botones de acción (✅ ❌)

### Configuración — Horarios
- [ ] `hora_fin` no puede ser menor o igual a `hora_inicio`
- [ ] Mínimo 1 hora de diferencia entre `hora_inicio` y `hora_fin`
- [ ] No permitir dos horarios del mismo día que se superpongan

---

## 🚀 Versión 2.0 — Multi-tenant

Cuando el producto esté pulido y haya un segundo cliente, migrar a arquitectura multi-tenant:

- Agregar columna `negocio_id` a todas las tablas
- Un solo dashboard con login por negocio (cada uno ve solo sus datos)
- Un solo n8n con workflows parametrizados por número de WhatsApp
- Un solo Supabase para todos los negocios
- Cada negocio se identifica por su número de WhatsApp (ya único)
- Cobrar suscripción mensual por negocio y dividir costo de infra

---

## 🏗️ Infraestructura — Nuevo proyecto por cliente (v1.x)

Mientras no se implemente multi-tenant, cada cliente nuevo requiere:

### Crear por cliente:
| Servicio | Acción |
|----------|--------|
| **Supabase** | Nuevo proyecto (misma cuenta, gratis hasta 2 activos) |
| **Vercel** | Nuevo proyecto apuntando al repo del cliente (misma cuenta, gratis ilimitado) |
| **GitHub** | Nuevo repo por cliente (misma cuenta) |
| **Railway** | Nuevo proyecto (misma cuenta, se paga por uso) |
| **n8n** | Nuevos workflows (misma instancia Railway) |
| **WhatsApp** | Nuevo número en la misma cuenta Meta Business |
| **Google Calendar** | Nuevo calendario en la misma cuenta Google |

### No necesitás crear cuenta nueva en:
- ✅ Meta (WhatsApp Business) — una sola cuenta, múltiples números
- ✅ Vercel — una sola cuenta, múltiples proyectos
- ✅ Railway — una sola cuenta, múltiples proyectos
- ✅ Google — una sola cuenta, múltiples calendarios
- ✅ GitHub — una sola cuenta, múltiples repos

### Costos estimados por cliente:
| Servicio | Costo |
|----------|-------|
| Railway (n8n) | ~$5/mes compartido entre clientes |
| Supabase | Gratis hasta 500MB / 50k filas (años de datos para un car wash) |
| Vercel | Gratis |
| WhatsApp API | Gratis hasta 1.000 conversaciones/mes iniciadas por el cliente |

---

## 💡 Ideas a evaluar
- Estadísticas por cliente (cuántas veces vino, cuánto gastó)
- Exportar ganancias a Excel o PDF
- Modo oscuro
