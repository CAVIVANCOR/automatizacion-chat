import { iniciarWhatsApp, obtenerEstadisticas } from './whatsapp.js';
import { config } from 'dotenv';

config();

console.log(`
╔═══════════════════════════════════════╗
║   🤖 WIN BOT - CONSULTAS DE VENTAS   ║
║        100% Open Source & Gratis      ║
║          Sin Base de Datos            ║
╚═══════════════════════════════════════╝
`);

// Iniciar bot de WhatsApp
(async () => {
  try {
    await iniciarWhatsApp();
    
    console.log('\n✅ Bot iniciado correctamente');
    console.log('📱 Esperando mensajes...');
    console.log('💾 Modo: Solo memoria (sin persistencia)\n');

    // Mostrar estadísticas cada hora
    setInterval(() => {
      const stats = obtenerEstadisticas();
      console.log(`\n📊 Estadísticas (en memoria): ${stats.total} consultas | ${stats.exitosas} exitosas | ${stats.errores} errores\n`);
    }, 3600000);

  } catch (error) {
    console.error('❌ Error al iniciar bot:', error);
    process.exit(1);
  }
})();

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando bot...');
  const stats = obtenerEstadisticas();
  console.log(`📊 Estadísticas finales: ${stats.total} consultas | ${stats.exitosas} exitosas | ${stats.errores} errores`);
  process.exit(0);
});
