# 🤖 WhatsApp Bot - Consultas de Ventas Win.pe

Bot de WhatsApp 100% gratuito y open source para automatizar consultas de estado de ventas en el sistema Win.pe.

## 📋 Características

- ✅ **100% Gratuito** - Sin costos mensuales
- ✅ **Open Source** - Código auditable y modificable
- ✅ **Sin Base de Datos** - Todo en memoria RAM
- ✅ **Automatización Web** - Puppeteer + Chromium
- ✅ **WhatsApp Nativo** - Funciona en grupos existentes
- ✅ **Respuesta Rápida** - 15-30 segundos por consulta
- ✅ **24/7** - Disponible todo el tiempo

## 🎯 ¿Cómo Funciona?

1. Usuario escribe en WhatsApp: `Estado 10008269`
2. Bot detecta el mensaje y extrae el DNI
3. Bot navega automáticamente al sistema Win.pe
4. Bot realiza login con Microsoft
5. Bot busca el cliente por DNI
6. Bot extrae los datos de la tabla
7. Bot responde en WhatsApp con formato profesional

**Tiempo total:** 15-30 segundos

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión | Licencia | Costo |
|------------|------------|---------|----------|-------|
| Cliente WhatsApp | Baileys | ^6.6.0 | MIT | ✅ Gratis |
| Automatización | Puppeteer | ^21.7.0 | Apache-2.0 | ✅ Gratis |
| Runtime | Node.js | 20.x LTS | MIT | ✅ Gratis |
| Logging | Pino | ^8.17.2 | MIT | ✅ Gratis |
| QR Terminal | qrcode-terminal | ^0.12.0 | Apache-2.0 | ✅ Gratis |

## 📦 Instalación

### Requisitos Previos

- **Node.js** v20.x o superior ([Descargar](https://nodejs.org/))
- **Git** (opcional)
- **WhatsApp** en tu teléfono

### Paso 1: Clonar o Descargar

```bash
git clone https://github.com/tu-usuario/automatizacion-chat.git
cd automatizacion-chat
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará:
- @whiskeysockets/baileys
- puppeteer (incluye Chromium ~350MB)
- pino
- qrcode-terminal
- dotenv

### Paso 3: Configurar Variables de Entorno

El archivo `.env` ya está configurado con las credenciales:

```env
WIN_EMAIL=Planeamiento@futurapro.pe
WIN_PASSWORD=PFutura24!
WIN_URL=https://accesoventas.win.pe/
BOT_ENABLED=true
DEBUG_MODE=false
```

⚠️ **IMPORTANTE:** Nunca subas el archivo `.env` a Git (ya está en `.gitignore`)

### Paso 4: Iniciar el Bot

```bash
npm start
```

### Paso 5: Escanear Código QR

1. El bot mostrará un código QR en la terminal
2. Abre WhatsApp en tu teléfono
3. Ve a **Configuración** → **Dispositivos vinculados**
4. Toca **Vincular un dispositivo**
5. Escanea el código QR

✅ **¡Listo!** El bot está activo y esperando mensajes.

## 📱 Uso

### Comando Básico

Escribe en cualquier chat o grupo de WhatsApp:

```
Estado 10008269
```

### Respuesta del Bot

```
📊 ESTADO DEL CLIENTE 10008269
━━━━━━━━━━━━━━━━━━━━━━━

📄 Doc Cliente: 10008269
📌 Estado Pedido: Validado
✅ Estado Orden: Ejecutada
📅 Fecha Programada: 12-01-2026
⏰ Tramo Horario: 12:00-00

━━━━━━━━━━━━━━━━━━━━━━━
🤖 Consulta automática Win Bot
```

### Casos de Uso

- ✅ **Grupos de ventas** - Consultas rápidas del equipo
- ✅ **Atención al cliente** - Respuestas inmediatas
- ✅ **Seguimiento de pedidos** - Estado en tiempo real
- ✅ **Reportes rápidos** - Sin acceder al sistema

## 🔧 Desarrollo

### Modo Desarrollo (Auto-reload)

```bash
npm run dev
```

Usa `nodemon` para reiniciar automáticamente al detectar cambios.

### Estructura del Proyecto

```
automatizacion-chat/
├── src/
│   ├── index.js       # Servidor principal
│   ├── whatsapp.js    # Cliente WhatsApp (Baileys)
│   └── scraper.js     # Automatización web (Puppeteer)
├── sessions/          # Sesiones de WhatsApp (auto-generado)
├── logs/              # Logs del sistema
├── .env               # Variables de entorno (NO SUBIR A GIT)
├── .gitignore         # Archivos ignorados por Git
├── package.json       # Dependencias del proyecto
└── README.md          # Este archivo
```

### Archivos Principales

#### `src/index.js`
- Punto de entrada del bot
- Inicializa el cliente de WhatsApp
- Muestra estadísticas cada hora
- Maneja cierre graceful

#### `src/whatsapp.js`
- Cliente de WhatsApp con Baileys
- Maneja conexión y reconexión
- Procesa mensajes entrantes
- Detecta patrón "Estado + DNI"
- Envía respuestas formateadas

#### `src/scraper.js`
- Automatización web con Puppeteer
- Login en sistema Win.pe
- Navegación automática
- Extracción de datos de tablas
- Manejo de errores

## 📊 Estadísticas

El bot mantiene estadísticas en memoria RAM:

```javascript
{
  total: 127,      // Total de consultas
  exitosas: 115,   // Consultas exitosas
  errores: 12      // Consultas con error
}
```

⚠️ **Nota:** Las estadísticas se resetean al reiniciar el bot (no hay persistencia).

## 🚀 Despliegue en Producción

### Opción 1: Oracle Cloud Free Tier (Recomendado)

**Ventajas:**
- ✅ Gratis para siempre
- ✅ 1GB RAM, 1 vCPU
- ✅ 200GB almacenamiento
- ✅ IP pública incluida

**Pasos:**
1. Crear cuenta en [Oracle Cloud](https://www.oracle.com/cloud/free/)
2. Crear instancia Ubuntu 22.04
3. Instalar Node.js y PM2
4. Clonar repositorio
5. Configurar PM2 para auto-restart

```bash
# En el servidor
npm install -g pm2
pm2 start src/index.js --name win-bot
pm2 save
pm2 startup
```

### Opción 2: Raspberry Pi

**Ventajas:**
- ✅ Hardware propio
- ✅ Sin costos mensuales
- ✅ Control total

**Requisitos:**
- Raspberry Pi 3B+ o superior (2GB+ RAM)
- Raspbian OS
- Conexión a internet estable

### Opción 3: VPS (DigitalOcean, Linode, etc.)

**Costo:** ~$5-10/mes

## 🔒 Seguridad

### Credenciales

- ✅ Nunca subir `.env` a Git
- ✅ Usar variables de entorno
- ✅ Rotar contraseñas periódicamente
- ✅ Limitar acceso al servidor

### Sesiones WhatsApp

- ✅ Carpeta `sessions/` en `.gitignore`
- ✅ Contiene autenticación de WhatsApp
- ✅ Hacer backup periódico
- ✅ No compartir con terceros

### Recomendaciones

1. **Firewall:** Solo abrir puertos necesarios
2. **SSH:** Usar autenticación por clave
3. **Updates:** Mantener sistema actualizado
4. **Logs:** Revisar logs regularmente
5. **Backups:** Backup de `sessions/` y `.env`

## 🐛 Solución de Problemas

### El bot no se conecta a WhatsApp

1. Verificar que WhatsApp esté instalado en el teléfono
2. Asegurarse de tener conexión a internet
3. Eliminar carpeta `sessions/` y volver a escanear QR
4. Verificar que no haya otro bot usando la misma sesión

### El scraper falla al hacer login

1. Verificar credenciales en `.env`
2. Revisar que el sistema Win.pe esté disponible
3. Verificar selectores CSS (pueden cambiar)
4. Aumentar timeouts si la conexión es lenta

### El bot no responde a mensajes

1. Verificar que el patrón sea correcto: `Estado 12345678`
2. Revisar logs en consola
3. Verificar que el bot esté conectado (✅ en consola)
4. Probar en modo debug: `DEBUG_MODE=true`

### Chromium no se descarga

```bash
# Instalar manualmente
npx puppeteer browsers install chrome
```

## 📈 Mejoras Futuras

- [ ] Agregar más comandos (Ayuda, Info, etc.)
- [ ] Soporte para múltiples sistemas (no solo Win.pe)
- [ ] Dashboard web para estadísticas
- [ ] Base de datos opcional (PostgreSQL/MongoDB)
- [ ] Notificaciones proactivas
- [ ] Integración con CRM
- [ ] API REST para consultas externas
- [ ] Soporte multi-idioma

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial*

## 🙏 Agradecimientos

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Cliente WhatsApp
- [Puppeteer](https://pptr.dev/) - Automatización web
- Comunidad Open Source

## 📞 Soporte

¿Necesitas ayuda? Abre un [Issue](https://github.com/tu-usuario/automatizacion-chat/issues)

---

**Hecho con ❤️ para automatizar consultas de ventas**
