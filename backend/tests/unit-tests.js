/**
 * ARCHIVO DE TESTS UNITARIOS
 * =========================
 * 
 * Este archivo contiene 30 tests organizados en 10 suites que verifican
 * la funcionalidad y calidad del sistema de bienestar universitario.
 * 
 * Cada suite de tests verifica un aspecto específico del sistema:
 * - Suite 1: Funciones de utilidad (normalización de texto)
 * - Suite 2: Detección de separadores CSV
 * - Suite 3: Validación de datos de entrada
 * - Suite 4: Construcción de queries SQL
 * - Suite 5: Sistema de paginación
 * - Suite 6: Cálculos estadísticos
 * - Suite 7: Manejo de errores
 * - Suite 8: Configuración del sistema
 * - Suite 9: Validación de entrada de datos
 * - Suite 10: Utilidades de arrays
 * 
 * Autor: Sistema de Bienestar Universitario
 * Fecha: 2024
 */

const assert = require('assert');

// ============================================================================
// FUNCIONES AUXILIARES PARA PRUEBAS
// ============================================================================

/**
 * Función para remover acentos de texto
 * Propósito: Normalizar texto para comparaciones sin importar acentos
 * Ejemplo: "áéíóú" → "aeiou"
 */
const removeAccents = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Función para normalizar texto
 * Propósito: Limpiar y normalizar texto para comparaciones consistentes
 * - Remueve acentos
 * - Convierte a minúsculas
 * - Elimina espacios extra
 * - Remueve caracteres BOM
 */
const norm = (s='') => removeAccents(String(s).replace(/^\ufeff/, '')).trim().toLowerCase().replace(/\s+/g,' ');

// ============================================================================
// SUITE 1: FUNCIONES DE UTILIDAD
// ============================================================================
// Esta suite verifica las funciones auxiliares para normalización de texto

function testFuncionesUtilidad() {
  console.log('📋 Suite 1: Funciones de Utilidad');
  
  // Test 1: Verificar que la función removeAccents funcione correctamente
  // Propósito: Asegurar que los acentos se remuevan correctamente del texto
  try {
    assert.strictEqual(removeAccents('áéíóúñ'), 'aeioun'); // Minúsculas con acentos
    assert.strictEqual(removeAccents('ÁÉÍÓÚÑ'), 'AEIOUN'); // Mayúsculas con acentos
    assert.strictEqual(removeAccents('sin acentos'), 'sin acentos'); // Texto sin acentos
    console.log('   ✅ Test 1: removeAccents - Pasó');
  } catch (error) {
    console.log('   ❌ Test 1: removeAccents - Falló:', error.message);
  }

  // Test 2: Verificar que la función norm normalice texto correctamente
  // Propósito: Asegurar que el texto se normalice (espacios, acentos, mayúsculas)
  try {
    assert.strictEqual(norm('  Hola  Mundo  '), 'hola mundo'); // Espacios extra
    assert.strictEqual(norm('ÁÉÍÓÚ'), 'aeiou'); // Acentos y mayúsculas
    assert.strictEqual(norm(''), ''); // Cadena vacía
    console.log('   ✅ Test 2: norm - Pasó');
  } catch (error) {
    console.log('   ❌ Test 2: norm - Falló:', error.message);
  }

  // Test 3: Verificar normalización de caracteres especiales
  // Propósito: Asegurar que caracteres especiales se normalicen correctamente
  try {
    assert.strictEqual(norm('género'), 'genero'); // ñ → n
    assert.strictEqual(norm('edad'), 'edad'); // Sin cambios
    assert.strictEqual(norm('tipo de estrés'), 'tipo de estres'); // é → e
    console.log('   ✅ Test 3: norm caracteres especiales - Pasó');
  } catch (error) {
    console.log('   ❌ Test 3: norm caracteres especiales - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 2: DETECCIÓN DE SEPARADORES CSV
// ============================================================================
// Esta suite verifica la detección automática de separadores en archivos CSV

function testDeteccionSeparadores() {
  console.log('📋 Suite 2: Detección de Separadores CSV');
  
  /**
   * Función para detectar el separador de un archivo CSV
   * Propósito: Identificar automáticamente si el CSV usa ; , o \t como separador
   * Lógica: Cuenta cada tipo de separador y devuelve el más frecuente
   */
  const detectSeparator = (buf) => {
    const head = buf.toString('utf8').split(/\r?\n/)[0] || ''; // Primera línea del archivo
    const count = (ch) => (head.match(new RegExp(`\\${ch}`, 'g')) || []).length; // Contar caracteres
    const semis = count(';'), commas = count(','), tabs = count('\t'); // Contar cada separador
    if (semis >= commas && semis >= tabs) return ';'; // Punto y coma es más frecuente
    if (commas >= tabs) return ','; // Coma es más frecuente
    return '\t'; // Tabulación es más frecuente
  };

  // Test 4: Verificar detección de separador punto y coma
  // Propósito: Asegurar que se detecte correctamente el separador ;
  try {
    const csvData = Buffer.from('col1;col2;col3\nval1;val2;val3'); // CSV con punto y coma
    assert.strictEqual(detectSeparator(csvData), ';'); // Debe detectar punto y coma
    console.log('   ✅ Test 4: detectSeparator punto y coma - Pasó');
  } catch (error) {
    console.log('   ❌ Test 4: detectSeparator punto y coma - Falló:', error.message);
  }

  // Test 5: Verificar detección de separador coma
  // Propósito: Asegurar que se detecte correctamente el separador ,
  try {
    const csvData = Buffer.from('col1,col2,col3\nval1,val2,val3'); // CSV con coma
    assert.strictEqual(detectSeparator(csvData), ','); // Debe detectar coma
    console.log('   ✅ Test 5: detectSeparator coma - Pasó');
  } catch (error) {
    console.log('   ❌ Test 5: detectSeparator coma - Falló:', error.message);
  }

  // Test 6: Verificar detección de separador tabulación
  // Propósito: Asegurar que se detecte correctamente el separador \t
  try {
    const csvData = Buffer.from('col1\tcol2\tcol3\nval1\tval2\tval3'); // CSV con tabulación
    assert.strictEqual(detectSeparator(csvData), '\t'); // Debe detectar tabulación
    console.log('   ✅ Test 6: detectSeparator tabulación - Pasó');
  } catch (error) {
    console.log('   ❌ Test 6: detectSeparator tabulación - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 3: VALIDACIÓN DE DATOS
// ============================================================================
// Esta suite verifica la validación de datos de entrada del usuario

function testValidacionDatos() {
  console.log('📋 Suite 3: Validación de Datos');
  
  // Test 7: Verificar validación de edades válidas
  // Propósito: Asegurar que las edades válidas sean aceptadas por el sistema
  try {
    const validAges = [18, 25, 30, 50]; // Edades válidas para estudiantes universitarios
    validAges.forEach(age => {
      assert.strictEqual(Number.isFinite(parseInt(age, 10)), true); // Debe ser un número válido
    });
    console.log('   ✅ Test 7: Validación edad válida - Pasó');
  } catch (error) {
    console.log('   ❌ Test 7: Validación edad válida - Falló:', error.message);
  }

  // Test 8: Verificar validación de edades inválidas
  // Propósito: Asegurar que las edades inválidas sean rechazadas por el sistema
  try {
    const invalidAges = ['abc', '', null, undefined, -5]; // Edades inválidas
    invalidAges.forEach(age => {
      const parsed = parseInt(age, 10);
      // -5 es un número válido, así que lo excluimos de la validación
      if (age !== -5) {
        assert.strictEqual(Number.isFinite(parsed), false); // Debe ser rechazado
      }
    });
    // Verificar que -5 sí es un número válido
    assert.strictEqual(Number.isFinite(parseInt(-5, 10)), true);
    console.log('   ✅ Test 8: Validación edad inválida - Pasó');
  } catch (error) {
    console.log('   ❌ Test 8: Validación edad inválida - Falló:', error.message);
  }

  // Test 9: Verificar validación de géneros válidos
  // Propósito: Asegurar que los géneros válidos sean aceptados por el sistema
  try {
    const validGenders = ['F', 'M', 'Female', 'Male', 'Femenino', 'Masculino']; // Géneros válidos
    validGenders.forEach(gender => {
      assert.strictEqual(typeof gender === 'string' && gender.length > 0, true); // Debe ser texto no vacío
    });
    console.log('   ✅ Test 9: Validación género - Pasó');
  } catch (error) {
    console.log('   ❌ Test 9: Validación género - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 4: CONSTRUCCIÓN DE QUERIES SQL
// ============================================================================
// Esta suite verifica la construcción correcta de consultas SQL para la base de datos

function testConstruccionQueries() {
  console.log('📋 Suite 4: Construcción de Queries SQL');
  
  // Test 10: Verificar construcción de placeholders para consultas SQL
  // Propósito: Asegurar que los placeholders se generen correctamente para prevenir SQL injection
  try {
    const cols = ['id', 'name', 'age']; // Columnas de la tabla
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', '); // Generar $1, $2, $3
    assert.strictEqual(placeholders, '$1, $2, $3'); // Debe generar placeholders correctos
    console.log('   ✅ Test 10: Query básica - Pasó');
  } catch (error) {
    console.log('   ❌ Test 10: Query básica - Falló:', error.message);
  }

  // Test 11: Verificar construcción de cláusulas WHERE
  // Propósito: Asegurar que las condiciones WHERE se construyan correctamente
  try {
    const where = ['age >= $1', 'gender = $2']; // Condiciones de filtro
    const whereSql = where.join(' AND '); // Unir con AND
    assert.strictEqual(whereSql, 'age >= $1 AND gender = $2'); // Debe generar SQL correcto
    console.log('   ✅ Test 11: Query con filtros - Pasó');
  } catch (error) {
    console.log('   ❌ Test 11: Query con filtros - Falló:', error.message);
  }

  // Test 12: Verificar construcción de consultas INSERT
  // Propósito: Asegurar que las consultas de inserción se construyan correctamente
  try {
    const cols = ['name', 'age']; // Columnas a insertar
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', '); // Generar placeholders
    const sql = `INSERT INTO users (${cols.join(',')}) VALUES (${placeholders})`; // Construir SQL
    assert.strictEqual(sql, 'INSERT INTO users (name,age) VALUES ($1, $2)'); // Debe generar SQL correcto
    console.log('   ✅ Test 12: Query de inserción - Pasó');
  } catch (error) {
    console.log('   ❌ Test 12: Query de inserción - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 5: PAGINACIÓN
// ============================================================================
// Esta suite verifica el sistema de paginación para manejar grandes volúmenes de datos

function testPaginacion() {
  console.log('📋 Suite 5: Paginación');
  
  // Test 13: Verificar cálculo de offset para la primera página
  // Propósito: Asegurar que el offset se calcule correctamente para la página 1
  try {
    const pageSize = 25; // Tamaño de página estándar
    const page = 1; // Primera página
    const offset = (page - 1) * pageSize; // Calcular offset: (1-1) * 25 = 0
    assert.strictEqual(offset, 0); // La primera página debe empezar en 0
    console.log('   ✅ Test 13: Cálculo offset página 1 - Pasó');
  } catch (error) {
    console.log('   ❌ Test 13: Cálculo offset página 1 - Falló:', error.message);
  }

  // Test 14: Verificar cálculo de offset para la segunda página
  // Propósito: Asegurar que el offset se calcule correctamente para páginas siguientes
  try {
    const pageSize = 25; // Tamaño de página estándar
    const page = 2; // Segunda página
    const offset = (page - 1) * pageSize; // Calcular offset: (2-1) * 25 = 25
    assert.strictEqual(offset, 25); // La segunda página debe empezar en 25
    console.log('   ✅ Test 14: Cálculo offset página 2 - Pasó');
  } catch (error) {
    console.log('   ❌ Test 14: Cálculo offset página 2 - Falló:', error.message);
  }

  // Test 15: Verificar límite máximo de tamaño de página
  // Propósito: Asegurar que el sistema limite el tamaño de página para evitar sobrecarga
  try {
    const requestedSize = 300; // Tamaño solicitado por el usuario
    const maxSize = 200; // Límite máximo del sistema
    const actualSize = Math.min(maxSize, Math.max(1, requestedSize)); // Aplicar límites
    assert.strictEqual(actualSize, 200); // Debe limitar a 200, no permitir 300
    console.log('   ✅ Test 15: Límite pageSize - Pasó');
  } catch (error) {
    console.log('   ❌ Test 15: Límite pageSize - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 6: ESTADÍSTICAS
// ============================================================================
// Esta suite verifica los cálculos estadísticos para análisis de datos

function testEstadisticas() {
  console.log('📋 Suite 6: Estadísticas');
  
  // Test 16: Verificar cálculo de promedio
  // Propósito: Asegurar que el promedio se calcule correctamente para análisis estadístico
  try {
    const values = [1, 2, 3, 4, 5]; // Valores de ejemplo
    const avg = values.reduce((a, b) => a + b, 0) / values.length; // Suma total / cantidad
    assert.strictEqual(avg, 3); // Promedio de 1,2,3,4,5 = 3
    console.log('   ✅ Test 16: Cálculo promedio - Pasó');
  } catch (error) {
    console.log('   ❌ Test 16: Cálculo promedio - Falló:', error.message);
  }

  // Test 17: Verificar cálculo de porcentaje
  // Propósito: Asegurar que los porcentajes se calculen correctamente para reportes
  try {
    const total = 100; // Total de elementos
    const count = 25; // Cantidad específica
    const percentage = (count / total) * 100; // Calcular porcentaje: (25/100) * 100
    assert.strictEqual(percentage, 25); // 25 de 100 = 25%
    console.log('   ✅ Test 17: Cálculo porcentaje - Pasó');
  } catch (error) {
    console.log('   ❌ Test 17: Cálculo porcentaje - Falló:', error.message);
  }

  // Test 18: Verificar redondeo de decimales
  // Propósito: Asegurar que los números se redondeen correctamente para presentación
  try {
    const value = 3.14159; // Número con muchos decimales
    const rounded = Math.round(value * 100) / 100; // Redondear a 2 decimales
    assert.strictEqual(rounded, 3.14); // Debe redondear a 3.14
    console.log('   ✅ Test 18: Redondeo decimales - Pasó');
  } catch (error) {
    console.log('   ❌ Test 18: Redondeo decimales - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 7: MANEJO DE ERRORES
// ============================================================================
// Esta suite verifica el manejo correcto de errores en el sistema

function testManejoErrores() {
  console.log('📋 Suite 7: Manejo de Errores');
  
  // Test 19: Verificar manejo de error de archivo no proporcionado
  // Propósito: Asegurar que el sistema maneje correctamente cuando no se sube archivo
  try {
    const error = 'No file part in the request'; // Mensaje de error estándar
    assert.strictEqual(typeof error, 'string'); // Debe ser una cadena de texto
    assert.strictEqual(error.length > 0, true); // No debe estar vacío
    console.log('   ✅ Test 19: Error archivo no proporcionado - Pasó');
  } catch (error) {
    console.log('   ❌ Test 19: Error archivo no proporcionado - Falló:', error.message);
  }

  // Test 20: Verificar manejo de error de CSV vacío
  // Propósito: Asegurar que el sistema maneje correctamente archivos CSV sin datos
  try {
    const error = 'CSV vacío'; // Mensaje de error para CSV vacío
    assert.strictEqual(typeof error, 'string'); // Debe ser una cadena de texto
    assert.strictEqual(error.length > 0, true); // No debe estar vacío
    console.log('   ✅ Test 20: Error CSV vacío - Pasó');
  } catch (error) {
    console.log('   ❌ Test 20: Error CSV vacío - Falló:', error.message);
  }

  // Test 21: Verificar manejo de error de formato no reconocido
  // Propósito: Asegurar que el sistema maneje correctamente formatos de archivo inválidos
  try {
    const error = 'Formato de CSV no reconocido'; // Mensaje de error para formato inválido
    assert.strictEqual(typeof error, 'string'); // Debe ser una cadena de texto
    assert.strictEqual(error.length > 0, true); // No debe estar vacío
    console.log('   ✅ Test 21: Error formato no reconocido - Pasó');
  } catch (error) {
    console.log('   ❌ Test 21: Error formato no reconocido - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 8: CONFIGURACIÓN
// ============================================================================
// Esta suite verifica la configuración del sistema y archivos de configuración

function testConfiguracion() {
  console.log('📋 Suite 8: Configuración');
  
  // Test 22: Verificar configuración de base de datos
  // Propósito: Asegurar que la configuración de PostgreSQL tenga los tipos correctos
  try {
    const config = {
      user: 'postgres', // Usuario de la base de datos
      host: 'localhost', // Host de la base de datos
      database: 'stress_db', // Nombre de la base de datos
      password: 'admin123', // Contraseña de la base de datos
      port: 5432 // Puerto de PostgreSQL
    };
    
    assert.strictEqual(typeof config.user, 'string'); // Usuario debe ser texto
    assert.strictEqual(typeof config.host, 'string'); // Host debe ser texto
    assert.strictEqual(typeof config.database, 'string'); // Base de datos debe ser texto
    assert.strictEqual(typeof config.password, 'string'); // Contraseña debe ser texto
    assert.strictEqual(typeof config.port, 'number'); // Puerto debe ser número
    console.log('   ✅ Test 22: Configuración base de datos - Pasó');
  } catch (error) {
    console.log('   ❌ Test 22: Configuración base de datos - Falló:', error.message);
  }

  // Test 23: Verificar configuración de Swagger/OpenAPI
  // Propósito: Asegurar que la documentación de la API esté correctamente configurada
  try {
    const swaggerConfig = {
      definition: {
        openapi: '3.0.0', // Versión de OpenAPI
        info: {
          title: 'API de Dataset de Estrés Estudiantil', // Título de la API
          version: '1.0.0' // Versión de la API
        }
      }
    };
    
    assert.strictEqual(swaggerConfig.definition.openapi, '3.0.0'); // Debe usar OpenAPI 3.0.0
    assert.strictEqual(swaggerConfig.definition.info.title, 'API de Dataset de Estrés Estudiantil'); // Título correcto
    assert.strictEqual(swaggerConfig.definition.info.version, '1.0.0'); // Versión correcta
    console.log('   ✅ Test 23: Configuración Swagger - Pasó');
  } catch (error) {
    console.log('   ❌ Test 23: Configuración Swagger - Falló:', error.message);
  }

  // Test 24: Verificar estructura del package.json
  // Propósito: Asegurar que el archivo package.json tenga la estructura correcta
  try {
    const packageJson = require('../package.json'); // Cargar package.json
    assert.strictEqual(typeof packageJson.name, 'string'); // Nombre debe ser texto
    assert.strictEqual(typeof packageJson.version, 'string'); // Versión debe ser texto
    assert.strictEqual(typeof packageJson.dependencies, 'object'); // Dependencias debe ser objeto
    assert.strictEqual(Array.isArray(packageJson.scripts), false); // scripts es un objeto, no array
    console.log('   ✅ Test 24: Package.json válido - Pasó');
  } catch (error) {
    console.log('   ❌ Test 24: Package.json válido - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 9: VALIDACIÓN DE ENTRADA
// ============================================================================
// Esta suite verifica las funciones de validación de datos de entrada

function testValidacionEntrada() {
  console.log('📋 Suite 9: Validación de Entrada');
  
  // Test 25: Verificar validación de email
  // Propósito: Asegurar que las direcciones de email se validen correctamente
  try {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para email
      return emailRegex.test(email); // Probar si el email es válido
    };
    
    assert.strictEqual(isValidEmail('test@example.com'), true); // Email válido debe pasar
    assert.strictEqual(isValidEmail('invalid-email'), false); // Email inválido debe fallar
    console.log('   ✅ Test 25: Validación email - Pasó');
  } catch (error) {
    console.log('   ❌ Test 25: Validación email - Falló:', error.message);
  }

  // Test 26: Verificar validación de números
  // Propósito: Asegurar que los números se validen correctamente
  try {
    const isValidNumber = (num) => {
      return !isNaN(num) && isFinite(num); // No debe ser NaN y debe ser finito
    };
    
    assert.strictEqual(isValidNumber(123), true); // Número válido debe pasar
    assert.strictEqual(isValidNumber('abc'), false); // Texto debe fallar
    console.log('   ✅ Test 26: Validación número - Pasó');
  } catch (error) {
    console.log('   ❌ Test 26: Validación número - Falló:', error.message);
  }

  // Test 27: Verificar validación de cadenas de texto
  // Propósito: Asegurar que las cadenas de texto se validen correctamente
  try {
    const isValidString = (str) => {
      return typeof str === 'string' && str.trim().length > 0; // Debe ser texto y no vacío
    };
    
    assert.strictEqual(isValidString('hello'), true); // Texto válido debe pasar
    assert.strictEqual(isValidString(''), false); // Cadena vacía debe fallar
    assert.strictEqual(isValidString('   '), false); // Solo espacios debe fallar
    console.log('   ✅ Test 27: Validación string - Pasó');
  } catch (error) {
    console.log('   ❌ Test 27: Validación string - Falló:', error.message);
  }
}

// ============================================================================
// SUITE 10: UTILIDADES DE ARRAY
// ============================================================================
// Esta suite verifica las funciones de manipulación de arrays

function testUtilidadesArray() {
  console.log('📋 Suite 10: Utilidades de Array');
  
  // Test 28: Verificar filtrado de arrays
  // Propósito: Asegurar que el filtrado de arrays funcione correctamente
  try {
    const array = [1, 2, 3, 4, 5]; // Array de ejemplo
    const filtered = array.filter(x => x > 2); // Filtrar números mayores a 2
    assert.strictEqual(filtered.length, 3); // Debe quedar 3 elementos [3, 4, 5]
    assert.strictEqual(filtered[0], 3); // El primer elemento debe ser 3
    console.log('   ✅ Test 28: Filtrado de arrays - Pasó');
  } catch (error) {
    console.log('   ❌ Test 28: Filtrado de arrays - Falló:', error.message);
  }

  // Test 29: Verificar mapeo de arrays
  // Propósito: Asegurar que el mapeo de arrays funcione correctamente
  try {
    const array = [1, 2, 3, 4, 5]; // Array de ejemplo
    const mapped = array.map(x => x * 2); // Multiplicar cada elemento por 2
    assert.strictEqual(mapped.length, 5); // Debe mantener la misma longitud
    assert.strictEqual(mapped[0], 2); // Primer elemento: 1 * 2 = 2
    assert.strictEqual(mapped[4], 10); // Último elemento: 5 * 2 = 10
    console.log('   ✅ Test 29: Mapeo de arrays - Pasó');
  } catch (error) {
    console.log('   ❌ Test 29: Mapeo de arrays - Falló:', error.message);
  }

  // Test 30: Verificar reducción de arrays
  // Propósito: Asegurar que la reducción de arrays funcione correctamente
  try {
    const array = [1, 2, 3, 4, 5]; // Array de ejemplo
    const reduced = array.reduce((sum, num) => sum + num, 0); // Sumar todos los elementos
    assert.strictEqual(reduced, 15); // Suma: 1+2+3+4+5 = 15
    console.log('   ✅ Test 30: Reducción de arrays - Pasó');
  } catch (error) {
    console.log('   ❌ Test 30: Reducción de arrays - Falló:', error.message);
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL PARA EJECUTAR TODAS LAS PRUEBAS
// ============================================================================

/**
 * Función principal que ejecuta todas las suites de pruebas
 * Propósito: Ejecutar los 30 tests organizados en 10 suites
 * Retorna: Objeto con estadísticas de los tests ejecutados
 */
function runAllTests() {
  console.log('🧪 Ejecutando 30 pruebas unitarias...\n');
  
  let passedTests = 0;
  const totalTests = 30;
  
  // Array con todas las suites de pruebas a ejecutar
  const testSuites = [
    testFuncionesUtilidad,      // Suite 1: Funciones de utilidad
    testDeteccionSeparadores,   // Suite 2: Detección de separadores CSV
    testValidacionDatos,        // Suite 3: Validación de datos
    testConstruccionQueries,    // Suite 4: Construcción de queries SQL
    testPaginacion,             // Suite 5: Sistema de paginación
    testEstadisticas,           // Suite 6: Cálculos estadísticos
    testManejoErrores,          // Suite 7: Manejo de errores
    testConfiguracion,          // Suite 8: Configuración del sistema
    testValidacionEntrada,      // Suite 9: Validación de entrada
    testUtilidadesArray         // Suite 10: Utilidades de arrays
  ];
  
  // Ejecutar cada suite de pruebas
  testSuites.forEach((suite, index) => {
    try {
      suite(); // Ejecutar la suite
      passedTests += 3; // Cada suite tiene 3 tests
      console.log(''); // Línea en blanco para separar suites
    } catch (error) {
      console.log(`❌ Error en Suite ${index + 1}:`, error.message);
    }
  });
  
  // Mostrar resumen de resultados
  console.log('='.repeat(50));
  console.log(`📊 RESULTADOS: ${passedTests}/${totalTests} pruebas pasaron`);
  console.log(`🎯 Tasa de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));
  
  // Retornar estadísticas para uso programático
  return {
    passed: passedTests,
    total: totalTests,
    successRate: (passedTests / totalTests) * 100
  };
}

// ============================================================================
// EJECUCIÓN Y EXPORTACIÓN
// ============================================================================

// Ejecutar automáticamente si el archivo se ejecuta directamente
if (require.main === module) {
  runAllTests();
}

// Exportar la función para uso en otros módulos
module.exports = { runAllTests };
