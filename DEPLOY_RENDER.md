# 🚀 Desplegar Bot en Render.com

## Paso 1: Preparar repositorio en GitHub

```bash
# En tu laptop, desde la carpeta del proyecto
cd C:\Proyectos\automatizacion-chat

# Inicializar Git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit - Win Bot WhatsApp"

# Crear repositorio en GitHub
# 1. Ir a https://github.com/new
# 2. Nombre: automatizacion-chat
# 3. Crear repositorio

# Subir código
git remote add origin https://github.com/TU_USUARIO/automatizacion-chat.git
git branch -M main
git push -u origin main
```

## Paso 2: Crear cuenta en Render

1. Ir a [render.com](https://render.com)
2. Click en **"Get Started"**
3. Registrarse con GitHub (recomendado)

## Paso 3: Crear nuevo Web Service

1. En el dashboard de Render, click en **"New +"**
2. Seleccionar **"Web Service"**
3. Conectar tu repositorio `automatizacion-chat`
4. Click en **"Connect"**

## Paso 4: Configurar el servicio

### Configuración básica:
- **Name:** `win-bot-whatsapp` (o el nombre que prefieras)
- **Region:** Oregon (US West) - más cercano a Perú
- **Branch:** `main`
- **Runtime:** Node
- **Instance Type:** Free (100% gratuito)

### Build & Deploy:
- **Build Command:** `npm install` (se configura automáticamente)
- **Start Command:** `npm start` (se configura automáticamente)
- **Auto-Deploy:** Yes (para que se actualice automáticamente con cada push)

## Paso 5: Configurar Variables de Entorno

En la sección **Environment**, agregar las siguientes variables:

```
WIN_EMAIL = Planeamiento@futurapro.pe
WIN_PASSWORD = PFutura24!
WIN_URL = https://accesoventas.win.pe/
NODE_ENV = production
```

**Importante:** Hacer click en **"Add"** después de cada variable.

## Paso 6: Deploy

1. Click en **"Create Web Service"**
2. Esperar a que termine el build (primera vez: 5-10 minutos)
3. Ver el progreso en la pestaña **"Logs"**

## Paso 7: Vincular WhatsApp

1. Una vez que el servicio esté corriendo, ir a **"Logs"**
2. Buscar el código QR en los logs (aparecerá como arte ASCII)
3. Abrir WhatsApp en tu teléfono
4. Ir a **Dispositivos vinculados** → **Vincular dispositivo**
5. Escanear el código QR que aparece en los logs
6. ¡Listo! El bot está en producción 🎉

## 🔄 Actualizar el Bot

Cada vez que hagas cambios:

```bash
# En tu laptop
git add .
git commit -m "Descripción de los cambios"
git push

# Render detectará el push y redesplegará automáticamente
```

## 📊 Monitoreo

### Ver logs en tiempo real:
1. En Render, ir a tu servicio
2. Click en **"Logs"**
3. Ver actividad del bot en tiempo real

### Reiniciar el servicio:
1. En Render, ir a tu servicio
2. Click en **"Manual Deploy"** → **"Clear build cache & deploy"**

## ⚠️ Limitaciones del Plan Free

- **Se duerme después de 15 minutos de inactividad**
- Se reactiva automáticamente al recibir un mensaje (tarda ~30 segundos)
- 750 horas/mes de uso (suficiente para uso moderado)

### Para mantenerlo activo 24/7:
- Upgrade a **Starter Plan** ($7/mes)
- O usar un servicio de "ping" para mantenerlo despierto

## 🐛 Solución de Problemas

### Error: "Build failed"
- Verificar que todos los archivos estén en el repositorio
- Revisar logs de build en Render
- Verificar que el proceso de build esté correcto

### **Proceso de Build**

1. Render detecta `render.yaml`
2. Instala Node.js 20.x
3. Ejecuta `npm install`
4. Instala Puppeteer y dependencias
5. Ejecuta `npm start`

**Nota:** Usamos Node.js nativo (no Docker) para mantener el plan 100% gratuito.

### Error: "WhatsApp no se conecta"
- Eliminar sesión y volver a escanear QR
- En Render: **Manual Deploy** → **Clear build cache & deploy**

### Error: "Puppeteer timeout"
- Verificar que las credenciales en variables de entorno sean correctas
- Verificar que la IP de Render tenga acceso a Win.pe

### El bot no responde
- Verificar en logs que el bot esté corriendo
- Verificar que WhatsApp esté vinculado
- Si el servicio está dormido (Free Plan), enviar un mensaje y esperar ~30 segundos

## 💡 Consejos

1. **Mantener sesión de WhatsApp:** La sesión se guarda en el contenedor, pero se pierde al redesplegar. Para evitar escanear QR cada vez, considera usar un plan pagado con volumen persistente.

2. **Logs:** Revisar logs regularmente para detectar errores.

3. **Seguridad:** Nunca subir el archivo `.env` a GitHub (ya está en `.gitignore`).

4. **Actualizaciones:** Hacer commits frecuentes con mensajes descriptivos.

## 📞 Soporte

Si tienes problemas:
1. Revisar logs en Render
2. Verificar variables de entorno
3. Revisar documentación de Render: https://render.com/docs

---

**¡Tu bot está listo para producción!** 🚀
