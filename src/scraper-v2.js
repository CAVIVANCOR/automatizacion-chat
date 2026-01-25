import puppeteer from 'puppeteer';
import { config } from 'dotenv';

config();

/**
 * Consulta el estado de un cliente en el sistema Win usando Puppeteer 24.x Locators API
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
      '--disable-gpu',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Configurar User-Agent realista
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    
    // Configurar headers adicionales
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    });
    
    // Ocultar que es un bot
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      
      // Simular plugins de Chrome
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      // Simular idiomas
      Object.defineProperty(navigator, 'languages', {
        get: () => ['es-ES', 'es', 'en-US', 'en'],
      });
    });
    
    await page.setViewport({ width: 1920, height: 1080 });

    // PASO 1: Navegar a la página de login
    console.log('📄 Navegando a Win...');
    await page.goto(process.env.WIN_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // PASO 2: Click en "Iniciar con Microsoft"
    console.log('🔐 Iniciando login con Microsoft...');
    
    // Tomar screenshot para debug
    await page.screenshot({ path: 'debug-login.png' });
    console.log('📸 Screenshot guardado: debug-login.png');
    
    // Esperar y buscar el botón usando evaluate (más confiable)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const clickedMicrosoft = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));
      const microsoftBtn = buttons.find(btn => 
        btn.textContent?.includes('Microsoft') || 
        btn.value?.includes('Microsoft') ||
        btn.innerText?.includes('Microsoft')
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
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    // PASO 4: Ingresar contraseña
    console.log('🔑 Ingresando contraseña...');
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    
    // Hacer click en el campo primero para asegurar que está enfocado
    await page.click('input[type="password"]');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Escribir contraseña usando evaluate (más confiable)
    await page.evaluate((password) => {
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) {
        passwordInput.value = password;
        // Disparar eventos para que la página detecte el cambio
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, process.env.WIN_PASSWORD);
    
    console.log('✅ Contraseña ingresada');
    
    // Esperar un momento antes de hacer click
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si hay mensajes de error antes de continuar
    const errorAntes = await page.evaluate(() => {
      const errorDiv = document.querySelector('[role="alert"], .error, .alert-error');
      return errorDiv ? errorDiv.textContent : null;
    });
    
    if (errorAntes) {
      console.log('⚠️ Error detectado:', errorAntes);
    }
    
    // Hacer click en el botón de submit de forma más robusta
    const clickedSubmit = await page.evaluate(() => {
      const submitBtn = document.querySelector('input[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
        return true;
      }
      return false;
    });
    
    if (!clickedSubmit) {
      // Fallback: buscar cualquier botón que diga "Iniciar"
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, input[type="button"]'));
        const loginBtn = buttons.find(btn => 
          btn.textContent?.includes('Iniciar') || 
          btn.value?.includes('Iniciar') ||
          btn.textContent?.includes('Sign in')
        );
        if (loginBtn) loginBtn.click();
      });
    }
    
    console.log('⏳ Esperando respuesta del servidor...');
    
    // Esperar navegación o timeout (más tiempo)
    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
        new Promise(resolve => setTimeout(resolve, 20000))
      ]);
    } catch (e) {
      console.log('⚠️ Navegación lenta o sin cambio de página');
    }
    
    // Esperar más tiempo para que cargue completamente
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar si hay mensajes de error después del login
    const errorDespues = await page.evaluate(() => {
      const errorDiv = document.querySelector('[role="alert"], .error, .alert-error, #passwordError');
      return errorDiv ? errorDiv.textContent : null;
    });
    
    if (errorDespues) {
      console.log('❌ Error de login:', errorDespues);
      throw new Error(`Error de autenticación: ${errorDespues}`);
    }
    
    // Screenshot después de login
    await page.screenshot({ path: 'debug-after-password.png' });
    console.log('📸 Screenshot guardado: debug-after-password.png');
    
    // Verificar la URL actual
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);

    // PASO 5: Manejar "¿Mantener sesión iniciada?" - Click en "No"
    console.log('❌ Rechazando mantener sesión...');
    try {
      await page.waitForSelector('input[value="No"]', { timeout: 5000 });
      await page.click('input[value="No"]');
      
      try {
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
          new Promise(resolve => setTimeout(resolve, 10000))
        ]);
      } catch (e) {
        console.log('⚠️ Navegación después de "No" lenta');
      }
    } catch (e) {
      console.log('⚠️ No apareció prompt de mantener sesión');
    }
    
    // Screenshot después de manejar sesión
    await page.screenshot({ path: 'debug-after-session.png' });
    console.log('📸 Screenshot guardado: debug-after-session.png');
    
    // Verificar URL actual
    const urlActual = page.url();
    console.log('📍 URL después de login:', urlActual);
    
    // Esperar a que cargue la página principal
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Screenshot de la página principal
    await page.screenshot({ path: 'debug-pagina-principal.png' });
    console.log('📸 Screenshot guardado: debug-pagina-principal.png');
    
    // PASO 6: Click en menú "Ventas" del menú superior
    console.log('📊 Haciendo click en menú Ventas...');
    
    const clickedVentasMenu = await page.evaluate(() => {
      // Buscar el enlace "Ventas" en el menú superior
      const links = Array.from(document.querySelectorAll('a'));
      const ventasLink = links.find(link => {
        const text = link.textContent?.trim();
        return text === 'Ventas' && link.href && !link.href.includes('#');
      });
      
      if (ventasLink) {
        ventasLink.click();
        return true;
      }
      return false;
    });
    
    if (!clickedVentasMenu) {
      console.log('⚠️ No se encontró el menú Ventas en la barra superior');
      await page.screenshot({ path: 'debug-no-ventas-menu.png' });
      throw new Error('No se encontró el menú Ventas');
    }
    
    console.log('✅ Click en menú Ventas');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // PASO 7: Click en submenú "Ventas" (segunda opción)
    console.log('📋 Haciendo click en submenú Ventas...');
    
    const clickedVentasSubmenu = await page.evaluate(() => {
      // Buscar todos los enlaces "Ventas" que aparecieron en el dropdown
      const links = Array.from(document.querySelectorAll('a'));
      const ventasLinks = links.filter(link => {
        const text = link.textContent?.trim();
        return text === 'Ventas';
      });
      
      // Hacer click en el segundo enlace "Ventas" (el del submenú)
      if (ventasLinks.length >= 2) {
        ventasLinks[1].click();
        return true;
      } else if (ventasLinks.length === 1) {
        // Si solo hay uno, hacer click en ese
        ventasLinks[0].click();
        return true;
      }
      return false;
    });
    
    if (!clickedVentasSubmenu) {
      console.log('⚠️ No se encontró el submenú Ventas');
      await page.screenshot({ path: 'debug-no-ventas-submenu.png' });
      throw new Error('No se encontró el submenú Ventas');
    }
    
    console.log('✅ Click en submenú Ventas');
    
    // Esperar navegación
    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }),
        new Promise(resolve => setTimeout(resolve, 15000))
      ]);
    } catch (e) {
      console.log('⚠️ Navegación lenta');
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Screenshot de la página de ventas
    await page.screenshot({ path: 'debug-pagina-ventas.png' });
    console.log('📸 Screenshot guardado: debug-pagina-ventas.png');

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

    // Esperar a que los campos estén disponibles
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Llenar campo "Desde" - Método más agresivo
    console.log('📅 Llenando campo Desde...');
    try {
      const desdeFilled = await page.evaluate((fecha) => {
        const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
        // El primer input de texto suele ser "Desde"
        const desdeInput = inputs[0];
        if (desdeInput) {
          desdeInput.value = fecha;
          desdeInput.dispatchEvent(new Event('input', { bubbles: true }));
          desdeInput.dispatchEvent(new Event('change', { bubbles: true }));
          desdeInput.dispatchEvent(new Event('blur', { bubbles: true }));
          return true;
        }
        return false;
      }, formatoFecha(fechaDesde));
      
      if (desdeFilled) {
        console.log('✅ Campo Desde llenado:', formatoFecha(fechaDesde));
      } else {
        console.log('⚠️ No se pudo llenar campo Desde');
      }
    } catch (e) {
      console.log('⚠️ Error llenando campo Desde:', e.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Llenar campo "Hasta"
    console.log('📅 Llenando campo Hasta...');
    try {
      const hastaFilled = await page.evaluate((fecha) => {
        const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
        // El segundo input de texto suele ser "Hasta"
        const hastaInput = inputs[1];
        if (hastaInput) {
          hastaInput.value = fecha;
          hastaInput.dispatchEvent(new Event('input', { bubbles: true }));
          hastaInput.dispatchEvent(new Event('change', { bubbles: true }));
          hastaInput.dispatchEvent(new Event('blur', { bubbles: true }));
          return true;
        }
        return false;
      }, formatoFecha(fechaHasta));
      
      if (hastaFilled) {
        console.log('✅ Campo Hasta llenado:', formatoFecha(fechaHasta));
      } else {
        console.log('⚠️ No se pudo llenar campo Hasta');
      }
    } catch (e) {
      console.log('⚠️ Error llenando campo Hasta:', e.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Llenar campo "Documento del cliente"
    console.log('📝 Llenando campo Documento del cliente...');
    try {
      const documentoFilled = await page.evaluate((dni) => {
        const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
        // El tercer input de texto suele ser "Documento del cliente"
        const docInput = inputs[2];
        if (docInput) {
          docInput.value = dni;
          docInput.dispatchEvent(new Event('input', { bubbles: true }));
          docInput.dispatchEvent(new Event('change', { bubbles: true }));
          docInput.dispatchEvent(new Event('blur', { bubbles: true }));
          docInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
          return true;
        }
        return false;
      }, dni);
      
      if (documentoFilled) {
        console.log('✅ Campo Documento llenado:', dni);
      } else {
        console.log('⚠️ No se pudo llenar campo Documento');
        // Intentar con todos los inputs visibles
        await page.evaluate((dni) => {
          const allInputs = Array.from(document.querySelectorAll('input'));
          for (const input of allInputs) {
            if (input.offsetParent !== null && !input.value) {
              input.value = dni;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
              break;
            }
          }
        }, dni);
      }
    } catch (e) {
      console.log('⚠️ Error llenando campo Documento:', e.message);
    }
    
    // Screenshot antes de buscar
    await page.screenshot({ path: 'debug-antes-buscar.png' });
    console.log('📸 Screenshot guardado: debug-antes-buscar.png');
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // PASO 9: Click en Buscar
    console.log('🔍 Ejecutando búsqueda...');
    
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
      await page.click('button[type="submit"]');
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));

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
        docCliente: getCell(6),           // DOC. CLIENTE (índice 6)
        estadoPedido: getCell(7),         // ESTADO PEDIDO (índice 7)
        motivoRechazo: getCell(8),        // MOTIVO RECHAZO PEDIDO (índice 8)
        estadoOrden: getCell(10),         // ESTADO ORDEN (índice 10)
        fechaProgramada: getCell(14),     // FECHA PROGRAMADA (índice 14)
        tramoHorario: getCell(15)         // TRAMO HORARIO (índice 15)
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
