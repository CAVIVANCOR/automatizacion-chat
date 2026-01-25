# 📚 Manual Técnico para Desarrolladores - Win Bot WhatsApp

## 🎯 Objetivo del Proyecto

Bot de WhatsApp automatizado que consulta el estado de ventas de clientes en el sistema Win.pe mediante web scraping con Puppeteer y responde automáticamente por WhatsApp usando Baileys.

---

## 🏗️ Arquitectura del Sistema

### **Componentes Principales**

```
automatizacion-chat/
├── src/
│   ├── index.js          # Punto de entrada - Inicializa el bot
│   ├── whatsapp.js       # Cliente WhatsApp (Baileys)
│   └── scraper-v2.js     # Web scraper (Puppeteer 24.x)
├── sessions/             # Sesiones de WhatsApp (auto-generado)
├── .env                  # Variables de entorno (credenciales)
├── package.json          # Dependencias del proyecto
├── Dockerfile            # Configuración para despliegue
└── render.yaml           # Configuración de Render.com
```

### **Flujo de Datos**

```
Usuario WhatsApp
    ↓ (Envía: "Estado 12345678")
Cliente WhatsApp (Baileys)
    ↓ (Detecta patrón y extrae DNI)
Scraper Puppeteer
    ↓ (Login → Navega → Busca → Extrae)
Sistema Win.pe
    ↓ (Retorna datos de tabla HTML)
Formateador de Respuesta
    ↓ (Genera mensaje con emojis)
Usuario WhatsApp
    ↓ (Recibe respuesta formateada)
```

---

## 🛠️ Stack Tecnológico

### **Runtime y Lenguaje**
- **Node.js 20.x** - Runtime JavaScript
- **ES Modules** - Sintaxis moderna de importación

### **Dependencias Principales**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@whiskeysockets/baileys` | ^6.6.0 | Cliente WhatsApp Web API |
| `puppeteer` | ^24.15.0 | Automatización de navegador (Chromium) |
| `pino` | ^8.17.2 | Sistema de logging |
| `qrcode-terminal` | ^0.12.0 | Generación de QR en terminal |
| `dotenv` | ^16.3.1 | Gestión de variables de entorno |

### **Dependencias de Desarrollo**
- `nodemon` ^3.0.2 - Hot reload en desarrollo

---

## 📋 Implementación Detallada

### **1. Cliente WhatsApp (`src/whatsapp.js`)**

#### **Inicialización**

```javascript
import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys';
```

**Características:**
- ✅ Autenticación multi-archivo (sesión persistente)
- ✅ Reconexión automática en caso de desconexión
- ✅ Manejo de QR code para vinculación
- ✅ Detección de patrones en mensajes (`/Estado\s+(\d{8})/i`)
- ✅ Estadísticas en memoria (total, exitosas, errores)

#### **Flujo de Autenticación**

1. Verifica si existe sesión guardada en `./sessions/`
2. Si no existe: genera QR code en terminal
3. Usuario escanea QR con WhatsApp
4. Sesión se guarda automáticamente
5. Reconexiones posteriores usan sesión guardada

#### **Procesamiento de Mensajes**

```javascript
async function procesarMensaje(sock, message) {
  // 1. Extraer texto del mensaje
  const text = message.message?.conversation || 
               message.message?.extendedTextMessage?.text;
  
  // 2. Detectar patrón "Estado 12345678"
  const match = text.match(/Estado\s+(\d{8})/i);
  
  // 3. Extraer DNI
  const dni = match[1];
  
  // 4. Ejecutar scraper
  const datos = await consultarEstadoCliente(dni);
  
  // 5. Formatear y enviar respuesta
  await sock.sendMessage(chatId, { text: respuesta });
}
```

---

### **2. Web Scraper (`src/scraper-v2.js`)**

#### **Configuración de Puppeteer**

```javascript
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--disable-blink-features=AutomationControlled'
  ]
});
```

**Configuración Anti-Detección:**

```javascript
// User-Agent realista
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)...');

// Headers HTTP completos
await page.setExtraHTTPHeaders({
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Accept': 'text/html,application/xhtml+xml...',
  // ...
});

// Ocultar webdriver
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false,
  });
});
```

#### **Flujo de Scraping**

**Paso 1: Login con Microsoft OAuth**

```javascript
// 1. Navegar a Win.pe
await page.goto(process.env.WIN_URL);

// 2. Click en "Iniciar con Microsoft"
const clickedMicrosoft = await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll('button, a'));
  const microsoftBtn = buttons.find(btn => 
    btn.textContent.includes('Iniciar con Microsoft')
  );
  if (microsoftBtn) {
    microsoftBtn.click();
    return true;
  }
  return false;
});

// 3. Ingresar email
await page.waitForSelector('input[type="email"]');
await page.type('input[type="email"]', process.env.WIN_EMAIL);
await page.click('input[type="submit"]');

// 4. Ingresar contraseña (método especial para evitar validación)
await page.evaluate((password) => {
  const passwordInput = document.querySelector('input[type="password"]');
  passwordInput.value = password;
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
  passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
}, process.env.WIN_PASSWORD);
```

**Paso 2: Navegación al Módulo de Ventas**

```javascript
// 1. Click en menú "Ventas" superior
const clickedVentasMenu = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a'));
  const ventasLink = links.find(link => 
    link.textContent?.trim() === 'Ventas'
  );
  if (ventasLink) {
    ventasLink.click();
    return true;
  }
  return false;
});

// 2. Click en submenú "Ventas" (dropdown)
const clickedVentasSubmenu = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a'));
  const ventasLinks = links.filter(link => 
    link.textContent?.trim() === 'Ventas'
  );
  if (ventasLinks.length >= 2) {
    ventasLinks[1].click(); // Segundo enlace
    return true;
  }
  return false;
});
```

**Paso 3: Llenado de Formulario de Búsqueda**

```javascript
// Calcular fechas (1 mes atrás)
const fechaHasta = new Date();
const fechaDesde = new Date();
fechaDesde.setMonth(fechaDesde.getMonth() - 1);

// Formato: DD-MM-YYYY
const formatoFecha = (fecha) => {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
};

// Llenar campos por índice (más confiable)
await page.evaluate((fechaDesde, fechaHasta, dni) => {
  const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
  
  // Campo "Desde" (primer input)
  inputs[0].value = fechaDesde;
  inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
  
  // Campo "Hasta" (segundo input)
  inputs[1].value = fechaHasta;
  inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  
  // Campo "Documento" (tercer input)
  inputs[2].value = dni;
  inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
}, formatoFecha(fechaDesde), formatoFecha(fechaHasta), dni);
```

**Paso 4: Extracción de Datos de Tabla**

```javascript
const datos = await page.evaluate(() => {
  const row = document.querySelector('table tbody tr');
  if (!row) return null;

  const cells = Array.from(row.querySelectorAll('td'));
  const getCell = (index) => cells[index]?.textContent?.trim() || 'N/A';

  return {
    docCliente: getCell(6),       // Columna 7
    estadoPedido: getCell(7),     // Columna 8
    motivoRechazo: getCell(8),    // Columna 9
    estadoOrden: getCell(10),     // Columna 11
    fechaProgramada: getCell(14), // Columna 15
    tramoHorario: getCell(15)     // Columna 16
  };
});
```

---

## 🔧 Configuración de Entorno

### **Variables de Entorno (`.env`)**

```env
# Credenciales de acceso a Win.pe
WIN_EMAIL=tu-email@empresa.com
WIN_PASSWORD=tu-contraseña-segura
WIN_URL=https://accesoventas.win.pe/

# Entorno (opcional)
NODE_ENV=production
```

**⚠️ IMPORTANTE:** 
- Nunca subir `.env` a Git (ya incluido en `.gitignore`)
- Usar contraseñas seguras
- Rotar credenciales periódicamente

---

## 🐳 Despliegue con Docker

### **Dockerfile Explicado**

```dockerfile
FROM node:20-slim

# Instalar Chromium y dependencias
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    # ... más dependencias de Puppeteer

# Configurar Puppeteer para usar Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

CMD ["npm", "start"]
```

**Optimizaciones:**
- ✅ Imagen `node:20-slim` (más ligera)
- ✅ Chromium del sistema (no descarga Puppeteer)
- ✅ `npm ci` en lugar de `npm install` (más rápido)
- ✅ Multi-stage build implícito

---

## 🚀 Despliegue en Render.com

### **Configuración (`render.yaml`)**

```yaml
services:
  - type: web
    name: win-bot-whatsapp
    env: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: WIN_EMAIL
        sync: false
      - key: WIN_PASSWORD
        sync: false
      - key: WIN_URL
        sync: false
```

### **Proceso de Build**

1. Render detecta `Dockerfile`
2. Construye imagen Docker
3. Instala dependencias de Chromium
4. Copia código fuente
5. Ejecuta `npm start`

### **Limitaciones del Plan Free**

- ⏰ Se duerme después de 15 minutos de inactividad
- 🔄 Se reactiva automáticamente al recibir mensaje (~30 seg)
- 💾 750 horas/mes de uso
- 🗄️ Sin volumen persistente (sesión se pierde al redesplegar)

**Solución para 24/7:** Upgrade a Starter Plan ($7/mes)

---

## 🔍 Debugging y Troubleshooting

### **Logs Locales**

```bash
# Ver logs en tiempo real
npm start

# Con nodemon (hot reload)
npm run dev
```

### **Logs en Render**

1. Dashboard → Tu servicio → **Logs**
2. Ver logs en tiempo real
3. Buscar errores con Ctrl+F

### **Screenshots de Debug**

El scraper genera screenshots automáticos:

```javascript
await page.screenshot({ path: 'debug-login.png' });
await page.screenshot({ path: 'debug-after-password.png' });
await page.screenshot({ path: 'debug-pagina-ventas.png' });
await page.screenshot({ path: 'debug-antes-buscar.png' });
```

**Ubicación:** Raíz del proyecto (no se suben a Git)

### **Errores Comunes**

#### **1. `page.waitForTimeout is not a function`**

**Causa:** Método deprecado en Puppeteer 24.x

**Solución:** Usar `setTimeout()` nativo
```javascript
await new Promise(resolve => setTimeout(resolve, 2000));
```

#### **2. `page.$x is not a function`**

**Causa:** XPath removido en Puppeteer 24.x

**Solución:** Usar `page.evaluate()` con selectores CSS
```javascript
await page.evaluate(() => {
  const element = document.querySelector('selector');
  element.click();
});
```

#### **3. `Navigation timeout exceeded`**

**Causa:** Página tarda mucho en cargar

**Solución:** Usar `Promise.race()` con timeout
```javascript
await Promise.race([
  page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }),
  new Promise(resolve => setTimeout(resolve, 15000))
]);
```

#### **4. Campos de formulario no se llenan**

**Causa:** Framework JavaScript (React/Vue) requiere eventos específicos

**Solución:** Disparar eventos manualmente
```javascript
input.value = valor;
input.dispatchEvent(new Event('input', { bubbles: true }));
input.dispatchEvent(new Event('change', { bubbles: true }));
input.dispatchEvent(new Event('blur', { bubbles: true }));
```

---

## 🧪 Testing

### **Pruebas Manuales**

```bash
# 1. Iniciar bot
npm start

# 2. Escanear QR con WhatsApp

# 3. Enviar mensaje de prueba
"Estado 12345678"

# 4. Verificar respuesta
```

### **Casos de Prueba**

| Caso | Input | Output Esperado |
|------|-------|-----------------|
| DNI válido | `Estado 42114648` | Datos del cliente |
| DNI inválido | `Estado 99999999` | "No se encontraron datos" |
| Formato incorrecto | `estado123` | Sin respuesta (no cumple patrón) |
| Sin DNI | `Estado` | Sin respuesta |

---

## 📊 Monitoreo y Estadísticas

### **Estadísticas en Memoria**

```javascript
const stats = {
  total: 0,      // Total de consultas
  exitosas: 0,   // Consultas exitosas
  errores: 0     // Consultas con error
};
```

**Limitación:** Se reinician al redesplegar

**Mejora futura:** Implementar persistencia con base de datos

---

## 🔐 Seguridad

### **Mejores Prácticas Implementadas**

1. ✅ Credenciales en variables de entorno
2. ✅ `.env` en `.gitignore`
3. ✅ Headers anti-detección
4. ✅ User-Agent realista
5. ✅ Sin logs de credenciales

### **Recomendaciones Adicionales**

- 🔒 Usar autenticación 2FA en cuenta Microsoft
- 🔑 Rotar credenciales cada 3 meses
- 📝 Auditar logs regularmente
- 🚫 No compartir sesiones de WhatsApp
- 🔐 Usar HTTPS en todas las comunicaciones

---

## 🚀 Mejoras Futuras

### **Corto Plazo**

- [ ] Agregar comando `/help` para instrucciones
- [ ] Implementar rate limiting (máx consultas por usuario)
- [ ] Agregar validación de DNI (8 dígitos)
- [ ] Mejorar manejo de errores con mensajes específicos

### **Mediano Plazo**

- [ ] Base de datos para estadísticas persistentes
- [ ] Dashboard web para monitoreo
- [ ] Notificaciones por email en caso de errores
- [ ] Soporte para múltiples usuarios simultáneos

### **Largo Plazo**

- [ ] API REST para consultas externas
- [ ] Integración con otros sistemas (CRM, ERP)
- [ ] Machine Learning para predicción de estados
- [ ] Soporte multi-idioma

---

## 📚 Referencias

### **Documentación Oficial**

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Cliente WhatsApp
- [Puppeteer 24.x](https://pptr.dev/) - Automatización web
- [Node.js](https://nodejs.org/docs/) - Runtime
- [Render.com](https://render.com/docs) - Plataforma de despliegue

### **Recursos Útiles**

- [Puppeteer Best Practices](https://pptr.dev/guides/page-interactions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [ES Modules](https://nodejs.org/api/esm.html)

---

## 👨‍💻 Contribución

### **Estructura de Commits**

```
tipo(alcance): descripción corta

Descripción detallada (opcional)

Ejemplos:
- feat(scraper): agregar soporte para múltiples DNIs
- fix(whatsapp): corregir reconexión automática
- docs(readme): actualizar instrucciones de despliegue
- refactor(scraper): optimizar extracción de datos
```

### **Flujo de Trabajo**

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Hacer commits descriptivos
4. Push a tu fork
5. Crear Pull Request

---

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para detalles

---

## 📞 Soporte Técnico

**Desarrollado por:** 13 El Futuro Hoy 2026  
**Website:** https://www.13elfuturohoy.com/  
**Versión:** 1.0.0  
**Última actualización:** Enero 2026

---

**¡Happy Coding!** 🚀
