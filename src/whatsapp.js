import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { consultarEstadoCliente } from './scraper-v2.js';

let sock;

// Estadísticas en memoria (opcional)
const stats = {
  total: 0,
  exitosas: 0,
  errores: 0
};

/**
 * Inicia el cliente de WhatsApp
 */
export async function iniciarWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('sessions');
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['Win Bot', 'Chrome', '1.0.0']
  });

  // Manejar código QR
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📱 ESCANEA ESTE CÓDIGO QR CON WHATSAPP:\n');
      console.log('Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo\n');
      qrcode.generate(qr, { small: false });
      console.log('\n⚠️ CÓDIGO QR EN FORMATO TEXTO (para debugging):');
      console.log(qr);
      console.log('\n💡 TIP: Si el QR no es legible, usa WhatsApp Web en tu PC para vincular más fácilmente.');
      console.log('   1. Abre https://web.whatsapp.com en tu navegador');
      console.log('   2. Escanea el QR que aparece ahí con tu teléfono');
      console.log('   3. El bot se conectará automáticamente\n');
    }

    if (connection === 'close') {
      const shouldReconnect = 
        (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      
      console.log('❌ Conexión cerrada. Reconectando:', shouldReconnect);
      
      if (shouldReconnect) {
        iniciarWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp conectado exitosamente');
    }
  });

  // Guardar credenciales
  sock.ev.on('creds.update', saveCreds);

  // Manejar mensajes entrantes
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      await procesarMensaje(msg);
    }
  });

  return sock;
}

/**
 * Procesa mensajes entrantes
 */
async function procesarMensaje(msg) {
  try {
    // Ignorar mensajes propios
    if (msg.key.fromMe) return;

    // Obtener texto del mensaje
    const texto = msg.message?.conversation || 
                  msg.message?.extendedTextMessage?.text || '';

    // Detectar patrón "Estado 12345678"
    const match = texto.match(/Estado\s+(\d{8})/i);
    
    if (!match) return;

    const dni = match[1];
    const chatId = msg.key.remoteJid;

    console.log(`\n🔔 Nueva consulta de ${chatId} para DNI: ${dni}`);
    stats.total++;

    // Enviar mensaje de "procesando"
    await sock.sendMessage(chatId, { 
      text: `⏳ Consultando estado del cliente ${dni}...\nEsto puede tomar unos segundos.` 
    });

    try {
      // Ejecutar consulta
      const datos = await consultarEstadoCliente(dni);

      if (datos) {
        // Formatear respuesta
        const respuesta = `
📊 *ESTADO DEL CLIENTE ${datos.docCliente}*
━━━━━━━━━━━━━━━━━━━━━━━

📄 *Doc Cliente:* ${datos.docCliente}
📌 *Estado Pedido:* ${datos.estadoPedido}
${datos.motivoRechazo !== 'N/A' ? `❌ *Motivo Rechazo:* ${datos.motivoRechazo}` : ''}
✅ *Estado Orden:* ${datos.estadoOrden}
📅 *Fecha Programada:* ${datos.fechaProgramada}
⏰ *Tramo Horario:* ${datos.tramoHorario}

━━━━━━━━━━━━━━━━━━━━━━━
🤖 _Consulta automática Win Bot_

_Desarrollado por 13 El Futuro Hoy 2026_
https://www.13elfuturohoy.com/
        `.trim();

        try {
          await sock.sendMessage(chatId, { text: respuesta });
          stats.exitosas++;
          console.log(`✅ Consulta exitosa para DNI: ${dni}`);
        } catch (sendError) {
          console.error('Error al enviar mensaje (reintentando):', sendError.message);
          // Reintentar después de 2 segundos
          await new Promise(resolve => setTimeout(resolve, 2000));
          try {
            await sock.sendMessage(chatId, { text: respuesta });
            stats.exitosas++;
            console.log(`✅ Consulta exitosa para DNI: ${dni} (reintento)`);
          } catch (retryError) {
            console.error('Error al enviar mensaje (segundo intento):', retryError.message);
            stats.errores++;
          }
        }
      } else {
        try {
          await sock.sendMessage(chatId, { 
            text: `❌ No se encontraron datos para el DNI: *${dni}*\n\nVerifique que el número sea correcto y que exista en el sistema.` 
          });
          console.log(`⚠️ Sin resultados para DNI: ${dni}`);
        } catch (sendError) {
          console.error('Error al enviar mensaje de "sin resultados":', sendError.message);
        }
      }
    } catch (error) {
      console.error('Error al procesar consulta:', error);
      
      try {
        await sock.sendMessage(chatId, { 
          text: `⚠️ *Error al consultar*\n\nOcurrió un problema al buscar el DNI: ${dni}\n\nPor favor, intente nuevamente en unos minutos.` 
        });
      } catch (sendError) {
        console.error('Error al enviar mensaje de error:', sendError.message);
      }
      stats.errores++;
    }
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
  }
}

/**
 * Obtiene estadísticas en memoria
 */
export function obtenerEstadisticas() {
  return { ...stats };
}

export { sock };
