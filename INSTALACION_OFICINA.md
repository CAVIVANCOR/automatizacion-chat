# 🖥️ Guía de Instalación - Laptop de Oficina

## 📋 Requisitos Previos

- Windows 10/11
- Node.js 18 o superior instalado
- Git instalado
- Conexión a internet

---

## 🚀 Instalación Paso a Paso

### **Paso 1: Clonar el Repositorio**

Abre PowerShell y ejecuta:

```bash
cd C:\Proyectos
git clone https://github.com/CAVIVANCOR/automatizacion-chat.git
cd automatizacion-chat
```

---

### **Paso 2: Instalar Dependencias**

```bash
npm install
```

Este proceso tomará 2-3 minutos. Instalará todas las librerías necesarias.

---

### **Paso 3: Configurar Variables de Entorno**

Crea el archivo `.env` con las credenciales de Win.pe:

```bash
notepad .env
```

Copia y pega esto en el archivo:

```
WIN_EMAIL=Planeamiento@futurapro.pe
WIN_PASSWORD=PFutura24!
WIN_URL=https://accesoventas.win.pe/
```

**Guarda el archivo** (Ctrl+S) y cierra el Notepad.

---

### **Paso 4: Ejecutar el Bot**

```bash
npm start
```

Verás algo como:

```
╔═══════════════════════════════════════╗
║   🤖 WIN BOT - CONSULTAS DE VENTAS   ║
║        100% Open Source & Gratis      ║
║          Sin Base de Datos            ║
╚═══════════════════════════════════════╝

✅ Bot iniciado correctamente
📱 Esperando mensajes...
```

---

### **Paso 5: Vincular WhatsApp**

Aparecerá un **código QR** en la consola.

1. Abre **WhatsApp** en tu teléfono
2. Ve a **Configuración** → **Dispositivos vinculados**
3. Toca **"Vincular un dispositivo"**
4. **Escanea el código QR** que aparece en la consola

Verás el mensaje:

```
✅ WhatsApp conectado exitosamente
```

---

## 📱 Cómo Usar el Bot

Envía un mensaje por WhatsApp con el formato:

```
Estado 12345678
```

Donde `12345678` es el DNI del cliente (8 dígitos).

El bot responderá con:
- Doc Cliente
- Estado Pedido
- Motivo Rechazo
- Estado Orden
- Fecha Programada
- Tramo Horario

---

## 🔄 Mantener el Bot Corriendo 24/7

### **Opción A: Usar PM2 (Recomendado)**

PM2 mantiene el bot corriendo en segundo plano:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar el bot con PM2
pm2 start src/index.js --name win-bot

# Guardar la configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

**Comandos útiles de PM2:**

```bash
pm2 status              # Ver estado del bot
pm2 logs win-bot        # Ver logs en tiempo real
pm2 restart win-bot     # Reiniciar el bot
pm2 stop win-bot        # Detener el bot
pm2 delete win-bot      # Eliminar el bot de PM2
```

---

### **Opción B: Dejar PowerShell Abierto**

Simplemente deja la ventana de PowerShell abierta con `npm start` corriendo.

**Nota:** Si cierras PowerShell, el bot se detendrá.

---

## 🔄 Actualizar el Bot

Si hay actualizaciones en el código:

```bash
cd C:\Proyectos\automatizacion-chat
git pull
npm install
npm start
```

O si usas PM2:

```bash
cd C:\Proyectos\automatizacion-chat
git pull
npm install
pm2 restart win-bot
```

---

## 🛠️ Solución de Problemas

### **El bot no inicia**

Verifica que Node.js esté instalado:

```bash
node --version
```

Debe mostrar versión 18 o superior.

---

### **Error de credenciales**

Verifica que el archivo `.env` tenga las credenciales correctas:

```bash
notepad .env
```

---

### **WhatsApp se desconecta**

El bot se reconectará automáticamente. Si no lo hace:

```bash
# Detener el bot (Ctrl+C)
# Eliminar sesiones antiguas
rmdir /s sessions
# Reiniciar el bot
npm start
# Escanear el QR nuevamente
```

---

### **El scraper no funciona**

Verifica que las credenciales de Win.pe sean correctas en el archivo `.env`.

---

## 📊 Monitoreo

### **Ver logs en tiempo real (con PM2):**

```bash
pm2 logs win-bot
```

### **Ver estadísticas:**

El bot muestra en consola:
- Consultas recibidas
- Consultas exitosas
- Errores

---

## 🔒 Seguridad

- ✅ El archivo `.env` NO está en GitHub (contiene credenciales)
- ✅ La carpeta `sessions/` NO está en GitHub (contiene sesión de WhatsApp)
- ✅ Mantén estas credenciales seguras
- ✅ No compartas el archivo `.env` con nadie

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del bot
2. Verifica que las credenciales sean correctas
3. Asegúrate de que la laptop tenga internet
4. Reinicia el bot

---

## 🎯 Resumen Rápido

```bash
# Instalación inicial (solo una vez)
cd C:\Proyectos
git clone https://github.com/CAVIVANCOR/automatizacion-chat.git
cd automatizacion-chat
npm install
notepad .env  # Agregar credenciales

# Ejecutar el bot
npm start

# O con PM2 (recomendado)
npm install -g pm2
pm2 start src/index.js --name win-bot
pm2 save
pm2 startup
```

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado (versión 18+)
- [ ] Git instalado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado con credenciales
- [ ] Bot ejecutado (`npm start`)
- [ ] WhatsApp vinculado (QR escaneado)
- [ ] Prueba realizada (enviar "Estado 12345678")
- [ ] PM2 instalado y configurado (opcional)

---

**¡Listo! El bot está funcionando en la laptop de la oficina.** 🎉

_Desarrollado por 13 El Futuro Hoy 2026_  
https://www.13elfuturohoy.com/
