/**
 * Sistema de logging estructurado para el backend
 * @author Felipe - Backend Developer
 * @version 1.0.0
 */

const winston = require('winston');
const path = require('path');

// Configuración de colores para consola
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
};

winston.addColors(colors);

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// Formato para consola (más legible)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// Crear el logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Logs de error en archivo separado
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Todos los logs en archivo combinado
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Agregar transporte de consola solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Funciones helper para logging específico
const apiLogger = {
  /**
   * Log de inicio de request
   * @param {Object} req - Request object
   */
  requestStart: (req) => {
    logger.info('API Request Started', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  },

  /**
   * Log de fin de request con métricas
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {number} duration - Duración en ms
   */
  requestEnd: (req, res, duration) => {
    logger.info('API Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length')
    });
  },

  /**
   * Log de error en API
   * @param {Error} error - Error object
   * @param {Object} req - Request object
   */
  apiError: (error, req) => {
    logger.error('API Error', {
      message: error.message,
      stack: error.stack,
      method: req.method,
      url: req.url,
      ip: req.ip
    });
  },

  /**
   * Log de operación de base de datos
   * @param {string} operation - Tipo de operación
   * @param {string} table - Tabla afectada
   * @param {number} duration - Duración en ms
   */
  dbOperation: (operation, table, duration) => {
    logger.info('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`
    });
  },

  /**
   * Log de error de base de datos
   * @param {Error} error - Error object
   * @param {string} operation - Operación que falló
   */
  dbError: (error, operation) => {
    logger.error('Database Error', {
      operation,
      message: error.message,
      code: error.code,
      detail: error.detail
    });
  },

  /**
   * Log de carga de archivo
   * @param {string} filename - Nombre del archivo
   * @param {number} size - Tamaño en bytes
   * @param {string} type - Tipo de archivo
   */
  fileUpload: (filename, size, type) => {
    logger.info('File Upload', {
      filename,
      size: `${size} bytes`,
      type
    });
  },

  /**
   * Log de procesamiento de datos
   * @param {string} operation - Operación realizada
   * @param {number} records - Número de registros procesados
   * @param {number} duration - Duración en ms
   */
  dataProcessing: (operation, records, duration) => {
    logger.info('Data Processing', {
      operation,
      records,
      duration: `${duration}ms`
    });
  },

  /**
   * Log de configuración del sistema
   * @param {string} component - Componente configurado
   * @param {Object} config - Configuración aplicada
   */
  systemConfig: (component, config) => {
    logger.info('System Configuration', {
      component,
      config: JSON.stringify(config)
    });
  },

  /**
   * Log de métricas de rendimiento
   * @param {string} metric - Nombre de la métrica
   * @param {number} value - Valor de la métrica
   * @param {string} unit - Unidad de medida
   */
  performance: (metric, value, unit) => {
    logger.info('Performance Metric', {
      metric,
      value,
      unit
    });
  }
};

// Middleware para logging automático de requests
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log al inicio del request
  apiLogger.requestStart(req);
  
  // Log al final del request
  res.on('finish', () => {
    const duration = Date.now() - start;
    apiLogger.requestEnd(req, res, duration);
  });
  
  next();
};

// Middleware para logging de errores
const errorLogger = (error, req, res, next) => {
  apiLogger.apiError(error, req);
  next(error);
};

module.exports = {
  logger,
  apiLogger,
  requestLogger,
  errorLogger
};
