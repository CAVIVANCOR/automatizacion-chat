# 📱 Manual de Usuario - Win Bot WhatsApp

## 🤖 ¿Qué es Win Bot?

Win Bot es un asistente automático de WhatsApp que te permite consultar el estado de ventas de clientes en el sistema Win.pe de forma rápida y sencilla, sin necesidad de ingresar al sistema manualmente.

---

## ✨ Características

- ✅ **Consultas instantáneas** - Obtén información en segundos
- ✅ **Disponible 24/7** - Consulta en cualquier momento
- ✅ **Fácil de usar** - Solo necesitas el número de DNI
- ✅ **Respuestas claras** - Información organizada y fácil de leer
- ✅ **100% por WhatsApp** - No necesitas instalar nada

---

## 📋 Requisitos

Para usar Win Bot necesitas:

1. ✅ Tener WhatsApp instalado en tu teléfono
2. ✅ Tener el número del bot agregado a tus contactos
3. ✅ Conocer el DNI del cliente que deseas consultar

---

## 🚀 Cómo Usar Win Bot

### **Paso 1: Agregar el Bot a tus Contactos**

1. Guarda el número del bot en tu agenda de contactos
2. Nombre sugerido: "Win Bot" o "Bot Ventas"

### **Paso 2: Iniciar una Conversación**

1. Abre WhatsApp
2. Busca el contacto "Win Bot"
3. Inicia una conversación

### **Paso 3: Realizar una Consulta**

Para consultar el estado de un cliente, envía un mensaje con el siguiente formato:

```
Estado 12345678
```

**Importante:**
- ✅ La palabra "Estado" puede estar en mayúsculas o minúsculas
- ✅ Debe haber un espacio entre "Estado" y el DNI
- ✅ El DNI debe tener exactamente 8 dígitos
- ✅ No uses puntos ni comas en el DNI

### **Ejemplos Correctos:**

```
Estado 42114648
estado 42114648
ESTADO 42114648
Estado 12345678
```

### **Ejemplos Incorrectos:**

```
❌ estado42114648          (falta espacio)
❌ Estado 4211464          (DNI incompleto)
❌ Estado 421146489        (DNI con 9 dígitos)
❌ Estado 42.114.648       (DNI con puntos)
❌ estado                  (falta el DNI)
```

---

## 📊 Entender la Respuesta

Cuando el bot encuentra información del cliente, recibirás un mensaje como este:

```
📊 ESTADO DEL CLIENTE 42114648
━━━━━━━━━━━━━━━━━━━━━━━

📄 Doc Cliente: 42114648
📌 Estado Pedido: Validado
❌ Motivo Rechazo: N/A
✅ Estado Orden: Ejecutado
📅 Fecha Programada: 13-01-2026
⏰ Tramo Horario: 20-01-2026

━━━━━━━━━━━━━━━━━━━━━━━
🤖 Consulta automática Win Bot

Desarrollado por 13 El Futuro Hoy 2026
https://www.13elfuturohoy.com/
```

### **¿Qué Significa Cada Campo?**

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **📄 Doc Cliente** | Número de documento del cliente | 42114648 |
| **📌 Estado Pedido** | Estado actual del pedido | Validado, Pendiente, Rechazado |
| **❌ Motivo Rechazo** | Razón del rechazo (si aplica) | N/A (si no hay rechazo) |
| **✅ Estado Orden** | Estado de la orden de entrega | Ejecutado, Programado, En proceso |
| **📅 Fecha Programada** | Fecha de entrega programada | 13-01-2026 |
| **⏰ Tramo Horario** | Fecha y hora de entrega | 20-01-2026 / 08:00:00 |

### **Estados Comunes del Pedido**

- **✅ Validado** - El pedido ha sido aprobado
- **⏳ Pendiente** - El pedido está en revisión
- **❌ Rechazado** - El pedido fue rechazado (ver motivo)
- **📦 En proceso** - El pedido está siendo preparado

### **Estados Comunes de la Orden**

- **✅ Ejecutado** - La orden fue completada
- **📅 Programado** - La entrega está programada
- **🚚 En tránsito** - El pedido está en camino
- **⏳ Pendiente** - Esperando procesamiento

---

## ⏱️ Tiempo de Respuesta

- **Consulta normal:** 10-15 segundos
- **Primera consulta del día:** 30-40 segundos (el sistema se está iniciando)
- **Sin resultados:** 5-10 segundos

**Nota:** Si el bot tarda más de 1 minuto, intenta enviar el mensaje nuevamente.

---

## ❌ Mensajes de Error

### **"No se encontraron datos para el DNI"**

**Posibles causas:**
- El DNI no existe en el sistema
- El DNI fue ingresado incorrectamente
- El cliente no tiene ventas registradas

**Solución:**
1. Verifica que el DNI sea correcto
2. Verifica que tenga exactamente 8 dígitos
3. Consulta en el sistema Win.pe manualmente para confirmar

### **"Error al consultar"**

**Posibles causas:**
- Problema temporal con el sistema Win.pe
- Problema de conexión del bot
- El bot está reiniciándose

**Solución:**
1. Espera 1-2 minutos
2. Intenta enviar el mensaje nuevamente
3. Si persiste, contacta al administrador

### **"Consultando estado del cliente..."**

Este mensaje indica que el bot está procesando tu solicitud. Es normal y debes esperar la respuesta.

---

## 💡 Consejos y Buenas Prácticas

### **✅ Hacer**

- ✅ Espera a que el bot responda antes de enviar otra consulta
- ✅ Verifica que el DNI sea correcto antes de enviar
- ✅ Guarda las respuestas importantes con captura de pantalla
- ✅ Usa el formato exacto: "Estado 12345678"

### **❌ No Hacer**

- ❌ No envíes múltiples consultas al mismo tiempo
- ❌ No uses el bot para spam o consultas masivas
- ❌ No compartas información sensible de clientes
- ❌ No intentes "hackear" o romper el bot

---

## 🔒 Privacidad y Seguridad

### **¿Qué Información Se Guarda?**

El bot **NO guarda** ninguna información personal:
- ❌ No guarda tu número de teléfono
- ❌ No guarda los DNIs consultados
- ❌ No guarda conversaciones
- ❌ No comparte información con terceros

### **¿Es Seguro?**

- ✅ El bot solo consulta información que ya existe en Win.pe
- ✅ Usa conexión segura (HTTPS)
- ✅ No solicita contraseñas ni datos personales
- ✅ Solo responde a consultas autorizadas

---

## 📞 Soporte y Ayuda

### **¿Necesitas Ayuda?**

Si tienes problemas con el bot:

1. **Revisa este manual** - La mayoría de dudas están respondidas aquí
2. **Verifica el formato** - Asegúrate de usar "Estado 12345678"
3. **Espera un momento** - A veces el bot puede estar ocupado
4. **Contacta al administrador** - Si el problema persiste

### **Contacto de Soporte**

- **Desarrollador:** 13 El Futuro Hoy
- **Website:** https://www.13elfuturohoy.com/
- **Email:** [Agregar email de soporte]

---

## ❓ Preguntas Frecuentes (FAQ)

### **1. ¿Puedo consultar varios DNIs a la vez?**

No, el bot procesa una consulta a la vez. Debes esperar la respuesta antes de enviar otra consulta.

### **2. ¿El bot funciona las 24 horas?**

Sí, el bot está disponible 24/7. Sin embargo, puede haber mantenimientos programados ocasionales.

### **3. ¿Puedo usar el bot desde varios teléfonos?**

Sí, puedes agregar el bot en todos tus dispositivos con WhatsApp.

### **4. ¿Qué hago si el bot no responde?**

1. Espera 2-3 minutos
2. Envía el mensaje nuevamente
3. Si persiste, contacta al administrador

### **5. ¿El bot cobra por las consultas?**

No, el servicio es completamente gratuito.

### **6. ¿Puedo consultar información de cualquier cliente?**

Solo puedes consultar información de clientes que existan en el sistema Win.pe y para los cuales tengas autorización.

### **7. ¿Cómo sé si el bot está funcionando?**

Si el bot está activo, responderá en menos de 1 minuto. Si no responde, puede estar en mantenimiento.

### **8. ¿Puedo usar el bot para reportes o estadísticas?**

No, el bot está diseñado solo para consultas individuales. Para reportes, usa el sistema Win.pe directamente.

### **9. ¿El bot reemplaza al sistema Win.pe?**

No, el bot es una herramienta complementaria para consultas rápidas. Para funciones avanzadas, usa Win.pe.

### **10. ¿Qué hago si recibo información incorrecta?**

Verifica la información en el sistema Win.pe directamente y reporta el problema al administrador.

---

## 📝 Ejemplos de Uso

### **Ejemplo 1: Consulta Exitosa**

**Usuario envía:**
```
Estado 42114648
```

**Bot responde:**
```
⏳ Consultando estado del cliente 42114648...
Esto puede tomar unos segundos.
```

**Luego:**
```
📊 ESTADO DEL CLIENTE 42114648
━━━━━━━━━━━━━━━━━━━━━━━

📄 Doc Cliente: 42114648
📌 Estado Pedido: Validado
✅ Estado Orden: Ejecutado
📅 Fecha Programada: 13-01-2026
⏰ Tramo Horario: 20-01-2026

━━━━━━━━━━━━━━━━━━━━━━━
🤖 Consulta automática Win Bot
```

### **Ejemplo 2: DNI No Encontrado**

**Usuario envía:**
```
Estado 99999999
```

**Bot responde:**
```
⏳ Consultando estado del cliente 99999999...
Esto puede tomar unos segundos.
```

**Luego:**
```
❌ No se encontraron datos para el DNI: 99999999

Verifique que el número sea correcto y que exista en el sistema.
```

### **Ejemplo 3: Formato Incorrecto**

**Usuario envía:**
```
estado123
```

**Bot responde:**
```
(Sin respuesta - formato no reconocido)
```

**Solución:** Usar el formato correcto: `Estado 12345678`

---

## 🎯 Casos de Uso Comunes

### **1. Verificar Estado de Entrega**

**Situación:** Un cliente llama preguntando cuándo llegará su pedido.

**Acción:**
1. Obtén el DNI del cliente
2. Envía: `Estado [DNI]`
3. Revisa la "Fecha Programada" y "Tramo Horario"
4. Informa al cliente

### **2. Confirmar Validación de Pedido**

**Situación:** Necesitas confirmar si un pedido fue aprobado.

**Acción:**
1. Envía: `Estado [DNI]`
2. Revisa el "Estado Pedido"
3. Si dice "Validado", el pedido fue aprobado

### **3. Investigar Rechazo de Pedido**

**Situación:** Un pedido fue rechazado y necesitas saber por qué.

**Acción:**
1. Envía: `Estado [DNI]`
2. Revisa el "Motivo Rechazo"
3. Toma acción según el motivo

---

## 📊 Glosario de Términos

| Término | Significado |
|---------|-------------|
| **DNI** | Documento Nacional de Identidad (8 dígitos) |
| **Estado Pedido** | Situación actual del pedido en el sistema |
| **Estado Orden** | Situación de la orden de entrega |
| **Validado** | Pedido aprobado y listo para procesarse |
| **Ejecutado** | Orden completada exitosamente |
| **Programado** | Entrega agendada para una fecha específica |
| **Tramo Horario** | Ventana de tiempo para la entrega |
| **N/A** | No Aplica (sin información disponible) |

---

## 🔄 Actualizaciones y Mejoras

El bot se actualiza periódicamente con nuevas funcionalidades. Mantente atento a los anuncios de nuevas características.

### **Próximas Mejoras Planeadas:**

- 📋 Comando `/help` para ayuda rápida
- 📊 Consulta de múltiples DNIs
- 📧 Notificaciones de cambios de estado
- 📈 Historial de consultas

---

## 📄 Términos de Uso

Al usar Win Bot, aceptas:

1. Usar el bot solo para fines laborales autorizados
2. No abusar del servicio con consultas excesivas
3. Mantener la confidencialidad de la información
4. No intentar modificar o hackear el bot
5. Reportar cualquier problema o error encontrado

---

## 🎓 Capacitación

### **Para Nuevos Usuarios**

1. Lee este manual completo
2. Practica con 2-3 consultas de prueba
3. Guarda el formato correcto en tus notas
4. Consulta el FAQ cuando tengas dudas

### **Para Administradores**

Si eres responsable de capacitar a otros usuarios:

1. Comparte este manual
2. Demuestra el uso correcto del bot
3. Resuelve dudas comunes
4. Reporta problemas técnicos

---

## 📞 Información de Contacto

**Desarrollado por:**  
13 El Futuro Hoy 2026

**Website:**  
https://www.13elfuturohoy.com/

**Versión del Manual:**  
1.0.0 - Enero 2026

---

## ✅ Checklist de Inicio Rápido

Antes de usar el bot por primera vez:

- [ ] Agregué el número del bot a mis contactos
- [ ] Leí la sección "Cómo Usar Win Bot"
- [ ] Entiendo el formato correcto: "Estado 12345678"
- [ ] Sé qué información recibiré en la respuesta
- [ ] Conozco los tiempos de respuesta esperados
- [ ] Sé qué hacer si hay un error

---

**¡Listo! Ya puedes empezar a usar Win Bot** 🚀

Si tienes alguna duda, consulta este manual o contacta al soporte técnico.

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0
