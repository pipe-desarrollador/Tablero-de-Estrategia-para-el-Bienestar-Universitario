/**
 * Configuración centralizada del backend
 * @author Felipe - Backend Developer
 * @version 1.0.0
 */

require('dotenv').config();

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
  },

  // Configuración de la base de datos
  database: process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20, // máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  } : {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'stress_db',
    password: process.env.DB_PASSWORD || 'admin123',
    port: parseInt(process.env.DB_PORT) || 5432,
    max: 20, // máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },

  // Configuración de seguridad
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    bcryptRounds: 12
  },

  // Configuración de archivos
  files: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024, // 2MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'csv').split(','),
    uploadPath: './uploads'
  },

  // Configuración de rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  },

  // Configuración de API
  api: {
    version: '1.0.0',
    basePath: '/api',
    docsPath: '/api-docs',
    timeout: 30000 // 30 segundos
  },

  // Configuración de validación
  validation: {
    maxAge: 120,
    minAge: 1,
    maxPageSize: 200,
    defaultPageSize: 25
  }
};

/**
 * Valida que la configuración sea correcta
 * @returns {Object} Resultado de la validación
 */
const validateConfig = () => {
  const errors = [];

  // Validar configuración de base de datos
  if (!config.database.user || !config.database.password) {
    errors.push('Configuración de base de datos incompleta');
  }

  // Validar configuración de seguridad
  if (config.security.jwtSecret === 'your-secret-key-here') {
    errors.push('JWT_SECRET debe ser configurado en producción');
  }

  // Validar configuración de archivos
  if (config.files.maxSize <= 0) {
    errors.push('MAX_FILE_SIZE debe ser mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obtiene la configuración para un entorno específico
 * @param {string} env - Entorno (development, production, test)
 * @returns {Object} Configuración del entorno
 */
const getConfigForEnv = (env = config.server.env) => {
  const baseConfig = { ...config };

  switch (env) {
  case 'production':
    return {
      ...baseConfig,
      server: {
        ...baseConfig.server,
        logLevel: 'warn'
      },
      logging: {
        ...baseConfig.logging,
        level: 'warn'
      }
    };

  case 'test':
    return {
      ...baseConfig,
      database: {
        ...baseConfig.database,
        database: 'stress_db_test'
      },
      logging: {
        ...baseConfig.logging,
        level: 'error'
      }
    };

  default:
    return baseConfig;
  }
};

module.exports = {
  config,
  validateConfig,
  getConfigForEnv
};
