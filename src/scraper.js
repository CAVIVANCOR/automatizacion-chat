import puppeteer from 'puppeteer';
import { config } from 'dotenv';

config();

// Helper para esperar (compatible con todas las versiones de Puppeteer)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Consulta el estado de un cliente en el sistema Win
 * @param {string} dni - Documento de identidad del cliente
 * @returns {Object|null} - Datos del cliente o null si no se encuentra
 */
export async function consultarEstadoCliente(dni) {
  console.log(`🔍 Iniciando consulta para DNI: ${dni}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // PASO 1: Navegar a la página de login
    console.log('📄 Navegando a Win...');
    await page.goto(process.env.WIN_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // PASO 2: Click en "Iniciar con Microsoft"
    console.log('🔐 Iniciando login con Microsoft...');
    await wait(2000);
    
    // Buscar y hacer click en botón "Iniciar con Microsoft" usando evaluate
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
    
    if (!clickedMicrosoft) {
      throw new Error('No se encontró el botón "Iniciar con Microsoft"');
    }
    
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    // PASO 3: Ingresar email
    console.log('📧 Ingresando email...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', process.env.WIN_EMAIL);
    await page.click('input[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // PASO 4: Ingresar contraseña
    console.log('🔑 Ingresando contraseña...');
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await page.type('input[type="password"]', process.env.WIN_PASSWORD);
    await page.click('input[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // PASO 5: Manejar "¿Mantener sesión iniciada?" - Click en "No"
    console.log('❌ Rechazando mantener sesión...');
    try {
      await page.waitForSelector('input[value="No"]', { timeout: 5000 });
      await page.click('input[value="No"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    } catch (e) {
      console.log('⚠️ No apareció prompt de mantener sesión');
    }

    // PASO 6: Navegar al menú Ventas
    console.log('📊 Navegando a Ventas...');
    await wait(2000);
    
    // Click en primer enlace "Ventas"
    const clickedVentas1 = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const ventasLink = links.find(link => link.textContent.includes('Ventas'));
      if (ventasLink) {
        ventasLink.click();
        return true;
      }
      return false;
    });
    
    if (!clickedVentas1) {
      throw new Error('No se encontró el menú Ventas');
    }
    
    await wait(1000);

    // PASO 7: Click en la segunda opción "Ventas" del menú desplegable
    await wait(1000);
    
    const clickedVentas2 = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const ventasLinks = links.filter(link => link.textContent.includes('Ventas'));
      if (ventasLinks.length >= 2) {
        ventasLinks[1].click();
        return true;
      }
      return false;
    });
    
    if (clickedVentas2) {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    } else {
      // Fallback: buscar por href
      await page.click('a[href*="listaVenta"], a[href*="ventas"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    }

    // PASO 8: Configurar búsqueda
    console.log('🔎 Configurando búsqueda...');
    
    // Calcular fechas (1 mes atrás)
    const fechaHasta = new Date();
    const fechaDesde = new Date();
    fechaDesde.setMonth(fechaDesde.getMonth() - 1);

    const formatoFecha = (fecha) => {
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();
      return `${dia}-${mes}-${anio}`;
    };

    // Llenar campos de fecha
    await page.waitForSelector('input[name="desde"], input[placeholder*="Desde"]');
    await page.evaluate((fecha) => {
      const input = document.querySelector('input[name="desde"], input[placeholder*="Desde"]');
      input.value = fecha;
    }, formatoFecha(fechaDesde));

    await page.evaluate((fecha) => {
      const input = document.querySelector('input[name="hasta"], input[placeholder*="Hasta"]');
      input.value = fecha;
    }, formatoFecha(fechaHasta));

    // Llenar documento del cliente
    await page.waitForSelector('input[name*="documento"], input[placeholder*="documento"]');
    await page.type('input[name*="documento"], input[placeholder*="documento"]', dni);

    // PASO 9: Click en Buscar
    console.log('🔍 Ejecutando búsqueda...');
    
    // Buscar y hacer click en botón "Buscar"
    const clickedBuscar = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const buscarBtn = buttons.find(btn => btn.textContent.includes('Buscar'));
      if (buscarBtn) {
        buscarBtn.click();
        return true;
      }
      return false;
    });
    
    if (!clickedBuscar) {
      // Fallback: buscar por type="submit"
      await page.click('button[type="submit"]');
    }
    
    await wait(3000);

    // PASO 10: Verificar si hay resultados
    const hayResultados = await page.evaluate(() => {
      const tabla = document.querySelector('table tbody');
      return tabla && tabla.querySelectorAll('tr').length > 0;
    });

    if (!hayResultados) {
      console.log('❌ No se encontraron resultados');
      return null;
    }

    // PASO 11: Hacer zoom al 80%
    await page.evaluate(() => {
      document.body.style.zoom = '0.8';
    });

    // PASO 12: Extraer datos de la tabla
    console.log('📋 Extrayendo datos...');
    const datos = await page.evaluate(() => {
      const row = document.querySelector('table tbody tr');
      if (!row) return null;

      const cells = Array.from(row.querySelectorAll('td'));
      
      // Función auxiliar para obtener texto de celda
      const getCell = (index) => cells[index]?.textContent?.trim() || 'N/A';

      return {
        docCliente: getCell(3),           // DOC. CLIENTE
        estadoPedido: getCell(5),         // ESTADO PEDIDO
        motivoRechazo: getCell(6),        // MOTIVO RECHAZO PEDIDO
        estadoOrden: getCell(8),          // ESTADO ORDEN
        fechaProgramada: getCell(12),     // FECHA PROGRAMADA
        tramoHorario: getCell(13)         // TRAMO HORARIO
      };
    });

    console.log('✅ Datos extraídos exitosamente');
    return datos;

  } catch (error) {
    console.error('❌ Error en scraper:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}
