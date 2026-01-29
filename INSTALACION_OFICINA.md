# 🖥️ Guía de Instalación - Laptop de Oficina

## 📋 PASO 1: Instalar Node.js

1. Descarga Node.js desde: https://nodejs.org
2. Ejecuta el instalador (siguiente, siguiente, siguiente)
3. Reinicia PowerShell
4. Verifica instalación:
```bash
node --version
```
Debe mostrar versión 20 o superior.

---

## � PASO 2: Instalar Git

1. Descarga Git desde: https://git-scm.com/download/win
2. Ejecuta el instalador (siguiente con opciones por defecto)
3. Reinicia PowerShell
4. Verifica instalación:
```bash
git --version
```

---

## 🚀 PASO 3: Clonar el Repositorio

Abre PowerShell y ejecuta:

```bash
cd C:\Proyectos
git clone https://github.com/CAVIVANCOR/automatizacion-chat.git
cd automatizacion-chat
```

---

## 📦 PASO 4: Instalar Dependencias

```bash
npm install
```

Espera 2-3 minutos.

---

## 🌐 PASO 5: Instalar Chrome para Puppeteer

```bash
npx puppeteer browsers install chrome
```

Espera a que descargue Chrome (~180 MB).

---

## ⚙️ PASO 6: Configurar Variables de Entorno

**IMPORTANTE:** El archivo debe llamarse `.env` (sin .txt)

```bash
notepad .env
```

Copia y pega **exactamente** esto:

```
WIN_EMAIL=Planeamiento@futurapro.pe
WIN_PASSWORD=PFutura24!
WIN_URL=https://accesoventas.win.pe/
```

**Guarda** (Ctrl+S) y cierra.

---

## 🚀 PASO 7: Ejecutar el Bot

```bash
npm start
```

Verás:

```
╔═══════════════════════════════════════╗
║   🤖 WIN BOT - CONSULTAS DE VENTAS   ║
╚═══════════════════════════════════════╝

✅ Bot iniciado correctamente
📱 Esperando mensajes...
```

---

## 📱 PASO 8: Vincular WhatsApp

Aparecerá un **código QR**.

1. Abre **WhatsApp** en tu teléfono
2. **Configuración** → **Dispositivos vinculados**
3. **Vincular un dispositivo**
4. **Escanea el QR**

Verás:

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

### **Error: Could not find Chrome**

Si ves este error, falta instalar Chrome para Puppeteer:

```bash
npx puppeteer browsers install chrome
```

---

### **Error: Invalid parameters (archivo .env)**

El archivo se llama `.env.txt` en lugar de `.env`:

```bash
ren .env.txt .env
type .env
```

Verifica que contenga las 3 líneas correctas (sin espacios extra).

---

### **Error: Bad MAC / WhatsApp se desconecta**

Sesión de WhatsApp corrupta o de otra laptop:

1. Detén el bot (Ctrl+C)
2. En tu teléfono: **WhatsApp** → **Dispositivos vinculados** → Cierra sesión en TODOS los dispositivos del bot
3. En PowerShell:
```bash
rmdir /s sessions
npm start
```
4. Escanea el QR nuevamente

---

### **El bot no inicia**

Verifica Node.js:

```bash
node --version
```

Debe mostrar versión 20 o superior.

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
# 1. Instalar Node.js desde https://nodejs.org
# 2. Instalar Git desde https://git-scm.com/download/win
# 3. Reiniciar PowerShell

# 4. Clonar repositorio
cd C:\Proyectos
git clone https://github.com/CAVIVANCOR/automatizacion-chat.git
cd automatizacion-chat

# 5. Instalar dependencias
npm install

# 6. Instalar Chrome para Puppeteer
npx puppeteer browsers install chrome

# 7. Crear archivo .env (sin .txt)
notepad .env
# Copiar las 3 líneas de credenciales, guardar y cerrar

# 8. Ejecutar el bot
npm start

# 9. Escanear QR con WhatsApp
```

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado (versión 20+)
- [ ] Git instalado
- [ ] PowerShell reiniciado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Chrome instalado para Puppeteer (`npx puppeteer browsers install chrome`)
- [ ] Archivo `.env` creado (sin .txt) con credenciales
- [ ] Bot ejecutado (`npm start`)
- [ ] WhatsApp vinculado (QR escaneado)
- [ ] Prueba realizada (enviar "Estado 12345678")
- [ ] PM2 instalado y configurado (opcional)

---

**¡Listo! El bot está funcionando en la laptop de la oficina.** 🎉

_Desarrollado por 13 El Futuro Hoy 2026_  
https://www.13elfuturohoy.com/
