/**
 * Utilidades para el procesamiento de datos CSV y validaciones
 * @author Felipe - Backend Developer
 * @version 1.0.0
 */

/**
 * Remueve acentos y caracteres especiales de un string
 * @param {string} s - String a procesar
 * @returns {string} String sin acentos
 * @example
 * removeAccents('áéíóúñ') // returns 'aeioun'
 * removeAccents('ÁÉÍÓÚÑ') // returns 'AEIOUN'
 */
const removeAccents = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Normaliza un string: remueve acentos, convierte a minúsculas y colapsa espacios
 * @param {string} s - String a normalizar
 * @returns {string} String normalizado
 * @example
 * norm('  Hola  Mundo  ') // returns 'hola mundo'
 * norm('ÁÉÍÓÚ') // returns 'aeiou'
 */
const norm = (s='') => removeAccents(String(s).replace(/^\ufeff/, '')).trim().toLowerCase().replace(/\s+/g,' ');

/**
 * Detecta automáticamente el separador usado en un archivo CSV
 * @param {Buffer} buf - Buffer del archivo CSV
 * @returns {string} Separador detectado (';', ',' o '\t')
 * @example
 * detectSeparator(Buffer.from('col1;col2;col3\nval1;val2;val3')) // returns ';'
 */
const detectSeparator = (buf) => {
  const head = buf.toString('utf8').split(/\r?\n/)[0] || '';
  const count = (ch) => (head.match(new RegExp(`\\${ch}`, 'g')) || []).length;
  const semis = count(';'), commas = count(','), tabs = count('\t');
  if (semis >= commas && semis >= tabs) return ';';
  if (commas >= tabs) return ',';
  return '\t';
};

/**
 * Valida si una edad es válida (número entero positivo)
 * @param {any} age - Valor a validar
 * @returns {boolean} true si la edad es válida
 * @example
 * isValidAge(25) // returns true
 * isValidAge('abc') // returns false
 * isValidAge(-5) // returns false
 */
const isValidAge = (age) => {
  const parsed = parseInt(age, 10);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 120;
};

/**
 * Valida si un género es válido
 * @param {string} gender - Género a validar
 * @returns {boolean} true si el género es válido
 * @example
 * isValidGender('F') // returns true
 * isValidGender('Female') // returns true
 * isValidGender('M') // returns true
 * isValidGender('Male') // returns true
 */
const isValidGender = (gender) => {
  if (!gender || typeof gender !== 'string') return false;
  const normalized = gender.toLowerCase().trim();
  return ['f', 'm', 'female', 'male', 'femenino', 'masculino', 'mujer', 'hombre'].includes(normalized);
};

/**
 * Construye placeholders para queries SQL parametrizadas
 * @param {number} count - Número de parámetros
 * @returns {string} String de placeholders ($1, $2, $3, ...)
 * @example
 * buildPlaceholders(3) // returns '$1, $2, $3'
 */
const buildPlaceholders = (count) => {
  return Array.from({length: count}, (_, i) => `$${i + 1}`).join(', ');
};

/**
 * Construye una cláusula WHERE para queries SQL
 * @param {Array<string>} conditions - Array de condiciones
 * @returns {string} Cláusula WHERE o string vacío
 * @example
 * buildWhereClause(['age >= $1', 'gender = $2']) // returns 'WHERE age >= $1 AND gender = $2'
 */
const buildWhereClause = (conditions) => {
  return conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
};

/**
 * Calcula el offset para paginación
 * @param {number} page - Número de página (1-based)
 * @param {number} pageSize - Tamaño de página
 * @returns {number} Offset calculado
 * @example
 * calculateOffset(2, 25) // returns 25
 */
const calculateOffset = (page, pageSize) => {
  return (Math.max(1, page) - 1) * Math.max(1, pageSize);
};

/**
 * Valida y limita el tamaño de página
 * @param {number} requestedSize - Tamaño solicitado
 * @param {number} maxSize - Tamaño máximo permitido
 * @returns {number} Tamaño validado
 * @example
 * validatePageSize(300, 200) // returns 200
 * validatePageSize(25, 200) // returns 25
 */
const validatePageSize = (requestedSize, maxSize = 200) => {
  return Math.min(maxSize, Math.max(1, parseInt(requestedSize, 10) || 25));
};

/**
 * Calcula el promedio de un array de números
 * @param {Array<number>} values - Array de valores
 * @returns {number} Promedio calculado
 * @example
 * calculateAverage([1, 2, 3, 4, 5]) // returns 3
 */
const calculateAverage = (values) => {
  if (!Array.isArray(values) || values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calcula el porcentaje de un valor respecto al total
 * @param {number} count - Valor a calcular
 * @param {number} total - Total de referencia
 * @returns {number} Porcentaje calculado
 * @example
 * calculatePercentage(25, 100) // returns 25
 */
const calculatePercentage = (count, total) => {
  if (total === 0) return 0;
  return (count / total) * 100;
};

/**
 * Redondea un número a un número específico de decimales
 * @param {number} value - Valor a redondear
 * @param {number} decimals - Número de decimales (default: 2)
 * @returns {number} Valor redondeado
 * @example
 * roundToDecimals(3.14159, 2) // returns 3.14
 */
const roundToDecimals = (value, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Genera un mensaje de error estructurado
 * @param {string} message - Mensaje de error
 * @param {string} code - Código de error opcional
 * @returns {Object} Objeto de error estructurado
 * @example
 * createError('Archivo no encontrado', 'FILE_NOT_FOUND')
 * // returns { error: 'Archivo no encontrado', code: 'FILE_NOT_FOUND' }
 */
const createError = (message, code = null) => {
  const error = { error: message };
  if (code) error.code = code;
  return error;
};

/**
 * Valida que un archivo CSV tenga el formato correcto
 * @param {Buffer} buffer - Buffer del archivo
 * @param {number} minRows - Número mínimo de filas requeridas
 * @returns {Object} Resultado de la validación
 * @example
 * validateCSV(buffer, 1) // returns { isValid: true, rowCount: 10 }
 */
const validateCSV = (buffer, minRows = 1) => {
  try {
    const content = buffer.toString('utf8');
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length < minRows) {
      return { isValid: false, error: `CSV debe tener al menos ${minRows} fila(s)` };
    }
    
    return { isValid: true, rowCount: lines.length };
  } catch (error) {
    return { isValid: false, error: 'Error al procesar archivo CSV' };
  }
};

/**
 * Detecta automáticamente la escala de datos Likert en un conjunto de valores
 * @param {Array} values - Array de valores numéricos
 * @returns {Object} Información sobre la escala detectada
 * @example
 * detectLikertScale([1, 2, 3, 4, 5]) // returns { min: 1, max: 5, scale: 5, needsNormalization: false }
 * detectLikertScale([10, 20, 30, 40, 50]) // returns { min: 10, max: 50, scale: 50, needsNormalization: true }
 */
function detectLikertScale(values) {
  const numericValues = values
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v) && v !== null && v !== undefined);
  
  if (numericValues.length === 0) {
    return { min: 1, max: 5, scale: 5, needsNormalization: false };
  }
  
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  const scale = max - min + 1;
  
  // Si ya está en escala 1-5, no necesita normalización
  if (min >= 1 && max <= 5 && scale <= 5) {
    return { min, max, scale, needsNormalization: false };
  }
  
  return { min, max, scale, needsNormalization: true };
}

/**
 * Normaliza un valor Likert de cualquier escala a la escala 1-5
 * @param {number|string} value - Valor a normalizar
 * @param {Object} scaleInfo - Información de la escala original
 * @returns {number} Valor normalizado entre 1 y 5
 * @example
 * normalizeLikertValue(50, { min: 10, max: 50, scale: 41 }) // returns 5
 * normalizeLikertValue(25, { min: 10, max: 50, scale: 41 }) // returns 2.5
 */
function normalizeLikertValue(value, scaleInfo) {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return null;
  }
  
  if (!scaleInfo.needsNormalization) {
    return Math.max(1, Math.min(5, numValue));
  }
  
  // Normalizar a escala 0-1 primero
  const normalized = (numValue - scaleInfo.min) / (scaleInfo.max - scaleInfo.min);
  
  // Escalar a 1-5
  const scaled = 1 + (normalized * 4);
  
  // Redondear a 1 decimal para mantener precisión
  return Math.round(scaled * 10) / 10;
}

/**
 * Normaliza todos los datos Likert en un conjunto de registros
 * @param {Array} records - Array de registros CSV
 * @param {Array} likertColumns - Array de nombres de columnas que contienen datos Likert
 * @returns {Object} Información sobre la normalización aplicada
 * @example
 * normalizeLikertData(records, ['anxiety', 'stress_level']) 
 * // returns { applied: true, columns: {...}, totalRecords: 100 }
 */
function normalizeLikertData(records, likertColumns) {
  if (!records || records.length === 0 || !likertColumns || likertColumns.length === 0) {
    return { applied: false, columns: {}, totalRecords: 0 };
  }
  
  const normalizationInfo = {};
  let totalNormalized = 0;
  
  // Primero, detectar la escala para cada columna
  for (const column of likertColumns) {
    const values = records
      .map(record => record[column])
      .filter(value => value !== null && value !== undefined && value !== '');
    
    if (values.length > 0) {
      const scaleInfo = detectLikertScale(values);
      normalizationInfo[column] = {
        originalScale: scaleInfo,
        normalized: false
      };
      
      // Si necesita normalización, aplicarla
      if (scaleInfo.needsNormalization) {
        for (const record of records) {
          if (record[column] !== null && record[column] !== undefined && record[column] !== '') {
            const originalValue = record[column];
            const normalizedValue = normalizeLikertValue(originalValue, scaleInfo);
            record[column] = normalizedValue;
            totalNormalized++;
          }
        }
        normalizationInfo[column].normalized = true;
      }
    }
  }
  
  return {
    applied: Object.values(normalizationInfo).some(col => col.normalized),
    columns: normalizationInfo,
    totalRecords: records.length,
    totalNormalized
  };
}

module.exports = {
  removeAccents,
  norm,
  detectSeparator,
  isValidAge,
  isValidGender,
  buildPlaceholders,
  buildWhereClause,
  calculateOffset,
  validatePageSize,
  calculateAverage,
  calculatePercentage,
  roundToDecimals,
  createError,
  validateCSV,
  normalizeLikertValue,
  detectLikertScale,
  normalizeLikertData
};
