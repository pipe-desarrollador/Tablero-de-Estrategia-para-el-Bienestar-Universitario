/**
 * Middleware global de manejo de errores
 * @author Felipe - Backend Developer
 * @version 1.0.0
 */

const { apiLogger } = require('../logger');

/**
 * Clase personalizada para errores de la aplicación
 */
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware para manejar errores de validación
 */
const validationErrorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Los datos proporcionados no son válidos',
      details: errors
    });
  }
  next(error);
};

/**
 * Middleware para manejar errores de base de datos
 */
const databaseErrorHandler = (error, req, res, next) => {
  if (error.code === '23505') { // Unique violation
    return res.status(409).json({
      error: 'Conflict',
      message: 'El recurso ya existe',
      code: 'DUPLICATE_ENTRY'
    });
  }
  
  if (error.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Referencia inválida',
      code: 'FOREIGN_KEY_VIOLATION'
    });
  }
  
  if (error.code === '42P01') { // Undefined table
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error de configuración de base de datos',
      code: 'TABLE_NOT_FOUND'
    });
  }
  
  next(error);
};

/**
 * Middleware para manejar errores de archivos
 */
const fileErrorHandler = (error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'El archivo es demasiado grande',
      code: 'FILE_TOO_LARGE'
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Campo de archivo inesperado',
      code: 'UNEXPECTED_FILE_FIELD'
    });
  }
  
  next(error);
};

/**
 * Middleware para manejar errores de sintaxis JSON
 */
const jsonErrorHandler = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'JSON inválido en el cuerpo de la petición',
      code: 'INVALID_JSON'
    });
  }
  next(error);
};

/**
 * Middleware principal de manejo de errores
 */
const globalErrorHandler = (error, req, res, _next) => {
  // Log del error
  apiLogger.apiError(error, req);
  
  // Si es un error operacional conocido
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }
  
  // Para errores de desarrollo, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack,
      code: 'INTERNAL_ERROR'
    });
  }
  
  // Para producción, mensaje genérico
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Algo salió mal en el servidor',
    code: 'INTERNAL_ERROR'
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La ruta ${req.originalUrl} no existe`,
    code: 'ROUTE_NOT_FOUND'
  });
};

/**
 * Middleware para validar tipos de contenido
 */
const contentTypeValidator = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Se requiere Content-Type: application/json',
        code: 'INVALID_CONTENT_TYPE'
      });
    }
  }
  next();
};

/**
 * Middleware para validar límites de tamaño de request
 */
const requestSizeValidator = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'El tamaño de la petición excede el límite permitido',
      code: 'REQUEST_TOO_LARGE'
    });
  }
  next();
};

/**
 * Middleware para rate limiting básico
 */
const rateLimiter = (() => {
  const requests = new Map();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxRequests = 100; // máximo 100 requests por ventana
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const userRequests = requests.get(ip);
      
      if (now > userRequests.resetTime) {
        userRequests.count = 1;
        userRequests.resetTime = now + windowMs;
      } else {
        userRequests.count++;
        
        if (userRequests.count > maxRequests) {
          return res.status(429).json({
            error: 'Too Many Requests',
            message: 'Demasiadas peticiones, intente más tarde',
            code: 'RATE_LIMIT_EXCEEDED'
          });
        }
      }
    }
    
    next();
  };
})();

module.exports = {
  AppError,
  validationErrorHandler,
  databaseErrorHandler,
  fileErrorHandler,
  jsonErrorHandler,
  globalErrorHandler,
  notFoundHandler,
  contentTypeValidator,
  requestSizeValidator,
  rateLimiter
};
