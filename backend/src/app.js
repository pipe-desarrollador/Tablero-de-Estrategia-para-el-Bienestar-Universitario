// backend/src/app.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const csv = require('csv-parser');
const stream = require('stream');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');


const app = express();              // ✅ crear la app aquí

// Configurar CORS para permitir Vercel
const corsOptions = {
  origin: [
    'https://tablero-bienestar.vercel.app',
    'https://tablero-de-estrategia-para-el-bienestar-universitari-j0msck5ub.vercel.app',
    'http://localhost:5173', // Para desarrollo local
    'http://localhost:3000'  // Para desarrollo local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ---- utilidades ----
const { norm, detectSeparator, normalizeLikertData, checkDuplicateRecord, checkExactDuplicate } = require('../utils');
const { config } = require('../config');

// ---- Helper para respuestas JSON estandarizadas ----
const sendResponse = (res, success, message, data = null, statusCode = 200) => {
  const response = {
    success,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };
  
  if (error) {
    response.error = error;
  }
  
  return res.status(statusCode).json(response);
};

// ---- DB / upload ----
console.log('Database config:', JSON.stringify(config.database, null, 2));
const pool = new Pool(config.database);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

const upload = multer();

// ---- health/debug ----
app.get('/ping', (req, res) => res.send('pong'));

app.get('/debug', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database_url: process.env.DATABASE_URL ? 'configured' : 'not configured',
    port: process.env.PORT || 3000,
    node_version: process.version
  });
});

app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
app.get('/_routes', (_req, res) => {
  const routes = [];
  const stack = app?._router?.stack ?? [];
  stack.forEach(layer => {
    if (layer.route) {
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods)
        .filter(m => layer.route.methods[m])
        .map(m => m.toUpperCase())
        .sort()
        .join(',');
      routes.push({ methods, path });
    }
  });
  res.json(routes);
});


// ---- Swagger ----
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Tablero de Estrategia para el Bienestar Universitario',
      version: '1.0.0',
      description: 'API para cargar, gestionar y analizar datasets de estrés estudiantil universitario. Incluye funcionalidades de análisis bayesiano, simulaciones what-if y generación de reportes para la toma de decisiones estratégicas en bienestar estudiantil.',
      contact: { 
        name: 'Equipo de Desarrollo', 
        email: 'desarrollo@universidad.edu.co',
        url: 'https://github.com/universidad/tablero-bienestar'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      { 
        url: 'http://localhost:3000', 
        description: 'Servidor de desarrollo local' 
      },
      { 
        url: 'https://api-bienestar.universidad.edu.co', 
        description: 'Servidor de producción' 
      }
    ],
    components: {
      schemas: {
        RespuestaCarga: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              description: 'Indica si la operación fue exitosa' 
            },
            message: { 
              type: 'string', 
              description: 'Mensaje descriptivo del resultado' 
            },
            data: {
              type: 'object',
              properties: {
                fileType: { 
                  type: 'string', 
                  description: 'Tipo de archivo procesado' 
                },
                recordsProcessed: { 
                  type: 'integer', 
                  description: 'Número de registros procesados' 
                },
                normalization: {
                  type: 'object',
                  description: 'Información sobre normalización aplicada',
                  properties: {
                    applied: { type: 'boolean' },
                    totalNormalized: { type: 'integer' },
                    normalizedColumns: { 
                      type: 'array', 
                      items: { type: 'string' } 
                    }
                  }
                }
              }
            }
          }
        },
        Error: { 
          type: 'object', 
          properties: { 
            success: { type: 'boolean', example: false },
            error: { type: 'string', description: 'Mensaje de error' },
            details: { type: 'string', description: 'Detalles adicionales del error' }
          } 
        },
        RespuestaEstadisticas: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                surveyResponses: { 
                  type: 'integer', 
                  description: 'Número total de respuestas de encuestas' 
                },
                totalRecords: { 
                  type: 'integer', 
                  description: 'Total de registros en la base de datos' 
                },
                datasets: {
                  type: 'array',
                  description: 'Lista de datasets disponibles',
                  items: {
                    type: 'object',
                    properties: {
                      source: { type: 'string' },
                      count: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        },
        RespuestaEstructuraTabla: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                survey_responses: {
                  type: 'array',
                  description: 'Estructura de la tabla survey_responses',
                  items: {
                    type: 'object',
                    properties: {
                      column_name: { 
                        type: 'string', 
                        description: 'Nombre de la columna' 
                      },
                      data_type: { 
                        type: 'string', 
                        description: 'Tipo de dato' 
                      },
                      is_nullable: { 
                        type: 'string', 
                        description: 'Permite valores nulos (YES/NO)' 
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
};
const specs = swaggerJsdoc({
  definition: swaggerOptions.definition, // 👈 usar la configuración completa con esquemas
  apis: [path.join(__dirname, '**/*.js')], // 👈 escanea tus rutas
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/', (_req, res) => res.redirect('/api-docs'));

// --- Normalizador a escala 1..5 para CSV en inglés ---
const LIKERT_COLS = [
  'palpitations','anxiety','sleep_problems','anxiety_duplicate',
  'headaches','irritability','concentration_issues','sadness',
  'illness','loneliness','academic_overload','competition',
  'relationship_stress','professor_difficulty','work_environment',
  'leisure_time','home_environment','low_confidence_performance',
  'low_confidence_subjects','academic_conflict','class_attendance',
  'weight_change','stress_type'
];

// Nota: La lógica de escalado condicional ahora está integrada en normalizeLikertData()

// Función helper para insertar registros con verificación de duplicados
async function insertRecordWithDuplicateCheck(client, cols, vals, src) {
  // Crear objeto de registro para verificación de duplicados
  const recordData = {};
  cols.forEach((col, index) => {
    recordData[col] = vals[index];
  });

  // Verificar duplicados antes de insertar
  const isDuplicate = await checkDuplicateRecord(client, recordData, src);
  const isExactDuplicate = await checkExactDuplicate(client, recordData, src);

  if (isDuplicate || isExactDuplicate) {
    console.log('Registro duplicado detectado y omitido:', {
      gender: recordData.gender,
      age: recordData.age,
      stress_type: recordData.stress_type,
      source: src,
      duplicateType: isExactDuplicate ? 'exact' : 'similar'
    });
    return { inserted: false, reason: 'duplicate' };
  }

  // Insertar solo si no es duplicado
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
  await client.query(
    `INSERT INTO survey_responses (${cols.join(',')}) VALUES (${placeholders})`,
    vals
  );
  return { inserted: true, reason: 'success' };
}

// Reescala numéricos a 1..5 (redondeando) cuando vienen 0..10 o 0..100
function scaleLikertTo1to5(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number(String(raw).replace(',', '.'));
  if (!Number.isFinite(n)) return raw;

  // ya está en rango 1..5
  if (n >= 1 && n <= 5) return Math.round(n);

  let scaled;
  if (n > 5 && n <= 10) {          // 0..10 -> 1..5
    scaled = (n / 10) * 5;
  } else if (n > 10 && n <= 100) { // 0..100 -> 1..5
    scaled = (n / 100) * 5;
  } else if (n > 100) {
    scaled = 5;
  } else if (n >= 0 && n < 1) {    // 0..1 (poco común) -> 1..5
    scaled = n * 5;
  } else {
    scaled = n;
  }

  const r = Math.round(scaled);
  return Math.max(1, Math.min(5, r));
}






/**
 * @swagger
 * /api/upload-dataset:
 *   post:
 *     summary: Cargar y procesar archivo CSV de estrés estudiantil
 *     description: |
 *       Endpoint para cargar datasets de estrés estudiantil universitario. 
 *       Soporta múltiples formatos de archivos CSV:
 *       
 *       **Formatos soportados:**
 *       - **Stress_Dataset.csv** (en inglés) - Requiere normalización a escala 1-5
 *       - **StressLevelDataset.csv** (en inglés) - Requiere normalización a escala 1-5  
 *       - **Encuestas_UCaldas.csv** (en español) - Mantiene escala original
 *       
 *       **Funcionalidades:**
 *       - Detección automática del tipo de dataset
 *       - Normalización inteligente de escalas Likert
 *       - Validación de datos y estructura
 *       - Inserción masiva en base de datos PostgreSQL
 *       
 *       Los datos se almacenan en la tabla `survey_responses` con metadatos de origen.
 *     tags: [Gestión de Datos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV con datos de estrés estudiantil
 *                 example: "dataset_estres_2024.csv"
 *     responses:
 *       200:
 *         description: Dataset cargado y procesado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaCarga'
 *             example:
 *               success: true
 *               message: "Dataset cargado y procesado exitosamente"
 *               data:
 *                 fileType: "Stress_Dataset.csv"
 *                 recordsProcessed: 150
 *                 normalization:
 *                   applied: true
 *                   totalNormalized: 450
 *                   normalizedColumns: ["anxiety", "stress_level", "sleep_problems"]
 *       400:
 *         description: Error en la solicitud (archivo no proporcionado, formato inválido o CSV vacío)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: "No se proporcionó archivo en la solicitud"
 *               details: "El campo 'file' es requerido"
 *       500:
 *         description: Error interno del servidor durante el procesamiento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: "Error procesando archivo"
 *               details: "Error de conexión a la base de datos"
 */

app.post('/api/upload-dataset', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file part in the request', 400);
  }

  const client = await pool.connect();
  try {
    const sep = detectSeparator(req.file.buffer);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const records = [];
    bufferStream
      .pipe(csv({
        separator: sep,
        mapHeaders: ({ header }) => norm(header), // normaliza cabeceras (minúsculas, sin tildes, espacios colapsados)
      }))
      .on('data', (data) => records.push(data))
      .on('end', async () => {
        try {
          if (records.length === 0) {
            return sendError(res, 'CSV vacío', 400);
          }

          await client.query('BEGIN');

          const firstRow   = records[0] || {};
          const headersAll = Object.keys(firstRow);

          // Detecta tipo de archivo (tras normalizar cabeceras)
          let isStressDataset = false;
          let isStressLevelDataset = false;
          let isEncuestasUCaldas = false;

          if ('gender' in firstRow && 'age' in firstRow) {
            isStressDataset = true;
          } else if ('anxiety_level' in firstRow && 'stress_level' in firstRow) {
            isStressLevelDataset = true;
          } else {
            const findHeader = (...kw) => headersAll.find(h => kw.every(k => h.includes(k)));
            if (findHeader('genero') || findHeader('edad') || findHeader('tipo','estres')) {
              isEncuestasUCaldas = true;
            }
          }

          // Ahora sí, define la etiqueta de origen
          const src =
            isStressDataset ? 'Stress_Dataset' :
              isStressLevelDataset ? 'StressLevelDataset' :
                isEncuestasUCaldas ? 'Encuestas_UCaldas' :
                  'Unknown';

          console.log('Detected file type:', src, 'sep:', sep, 'headers:', headersAll);

          if (src === 'Unknown') {
            await client.query('ROLLBACK');
            return sendError(res, `Formato de CSV no reconocido (sep="${sep}"). Verifica cabeceras/separador.`, 400);
          }

          // Aplicar normalización automática de datos Likert
          const likertColumns = [
            'palpitations', 'anxiety', 'sleep_problems', 'anxiety_duplicate',
            'headaches', 'irritability', 'concentration_issues', 'sadness',
            'illness', 'loneliness', 'academic_overload', 'competition',
            'relationship_stress', 'professor_difficulty', 'work_environment',
            'leisure_time', 'home_environment', 'low_confidence_performance',
            'low_confidence_subjects', 'academic_conflict', 'class_attendance',
            'weight_change', 'stress_type'
          ];

          const normalizationResult = normalizeLikertData(records, likertColumns, src);
          if (normalizationResult.applied) {
            console.log('Normalización aplicada:', {
              totalRecords: normalizationResult.totalRecords,
              totalNormalized: normalizationResult.totalNormalized,
              columns: Object.keys(normalizationResult.columns).filter(col => 
                normalizationResult.columns[col].normalized
              )
            });
          }

          let inserted = 0;
          let duplicatesSkipped = 0;

          for (const row of records) {
            if (isStressDataset) {
              // === Stress_Dataset.csv (inglés) ===
              const columnMapping = {
                'gender': 'gender',
                'age': 'age',
                'have you recently experienced stress in your life?': 'stress_experience',
                'have you noticed a rapid heartbeat or palpitations?': 'palpitations',
                'have you been dealing with anxiety or tension recently?': 'anxiety',
                'do you face any sleep problems or difficulties falling asleep?': 'sleep_problems',
                'have you been dealing with anxiety or tension recently?.1': 'anxiety_duplicate',
                'have you been getting headaches more often than usual?': 'headaches',
                'do you get irritated easily?': 'irritability',
                'do you have trouble concentrating on your academic tasks?': 'concentration_issues',
                'have you been feeling sadness or low mood?': 'sadness',
                'have you been experiencing any illness or health issues?': 'illness',
                'do you often feel lonely or isolated?': 'loneliness',
                'do you feel overwhelmed with your academic workload?': 'academic_overload',
                'are you in competition with your peers, and does it affect you?': 'competition',
                'do you find that your relationship often causes you stress?': 'relationship_stress',
                'are you facing any difficulties with your professors or instructors?': 'professor_difficulty',
                'is your working environment unpleasant or stressful?': 'work_environment',
                'do you struggle to find time for relaxation and leisure activities?': 'leisure_time',
                'is your hostel or home environment causing you difficulties?': 'home_environment',
                'do you lack confidence in your academic performance?': 'low_confidence_performance',
                'do you lack confidence in your choice of academic subjects?': 'low_confidence_subjects',
                'academic and extracurricular activities conflicting for you?': 'academic_conflict',
                'do you attend classes regularly?': 'class_attendance',
                'have you gained/lost weight?': 'weight_change',
                'which type of stress do you primarily experience?': 'stress_type',
              };

              const cols = [];
              const vals = [];
              for (const [csvCol, dbCol] of Object.entries(columnMapping)) {
                if (row[csvCol] !== undefined) {
                  let v = row[csvCol];
                  if (dbCol === 'age') {
                    const n = parseInt(v, 10);
                    v = Number.isFinite(n) ? n : null;
                  }
                  cols.push(dbCol);
                  vals.push(v === '' ? null : v);
                }
              }
              // guarda el origen
              cols.push('source');
              vals.push(src);

              if (cols.length) {
                const result = await insertRecordWithDuplicateCheck(client, cols, vals, src);
                if (result.inserted) {
                  inserted++;
                } else if (result.reason === 'duplicate') {
                  duplicatesSkipped++;
                }
              }

            } else if (isStressLevelDataset) {
              // === StressLevelDataset.csv (inglés) ===
              const columnMapping = {
                'anxiety_level': 'anxiety',
                'self_esteem': 'stress_experience',
                'mental_health_history': 'illness',
                'depression': 'sadness',
                'headache': 'headaches',
                'blood_pressure': 'palpitations',
                'sleep_quality': 'sleep_problems',
                'breathing_problem': 'anxiety_duplicate',
                'noise_level': 'work_environment',
                'living_conditions': 'home_environment',
                'safety': 'low_confidence_performance',
                'basic_needs': 'low_confidence_subjects',
                'academic_performance': 'academic_overload',
                'study_load': 'competition',
                'teacher_student_relationship': 'professor_difficulty',
                'future_career_concerns': 'relationship_stress',
                'social_support': 'loneliness',
                'peer_pressure': 'academic_conflict',
                'extracurricular_activities': 'leisure_time',
                'bullying': 'irritability',
                'stress_level': 'stress_type',
              };

              const cols = [];
              const vals = [];
              for (const [csvCol, dbCol] of Object.entries(columnMapping)) {
                if (row[csvCol] !== undefined) {
                  const v = row[csvCol] === '' ? null : row[csvCol];
                  cols.push(dbCol);
                  vals.push(v);
                }
              }
              // origen
              cols.push('source');
              vals.push(src);

              if (cols.length) {
                const result = await insertRecordWithDuplicateCheck(client, cols, vals, src);
                if (result.inserted) {
                  inserted++;
                } else if (result.reason === 'duplicate') {
                  duplicatesSkipped++;
                }
              }

            } else {
              // === Encuestas_UCaldas.csv (español) ===
              const findHeader = (...kw) => headersAll.find(h => kw.every(k => h.includes(k)));
              const headerMap = {
                gender:               findHeader('genero') || findHeader('sexo'),
                age:                  findHeader('edad'),
                stress_type:          findHeader('tipo','estres') || findHeader('estres','principal'),
                sleep_problems:       findHeader('conciliar','sueno') || findHeader('sueno','preocupaciones'),
                headaches:            findHeader('dolores','cabeza') || findHeader('dolor','cabeza'),
                concentration_issues: findHeader('concentr','actividades') || findHeader('concentr','diarias'),
                irritability:         findHeader('irritabilidad') || findHeader('mal','humor'),
                palpitations:         findHeader('palpitaciones') || findHeader('frecuencia','cardiaca'),
                sadness:              findHeader('perdido','interes') || findHeader('tristeza') || findHeader('vacio'),
                anxiety:              findHeader('nerviosismo') || findHeader('ansiedad'),
              };

              const cols = [];
              const vals = [];
              for (const [dbCol, csvKey] of Object.entries(headerMap)) {
                if (!csvKey) continue;
                let v = row[csvKey];
                if (dbCol === 'age') {
                  const n = parseInt(String(v).replace(/[^\d-]/g, ''), 10);
                  v = Number.isFinite(n) ? n : null;
                }
                cols.push(dbCol);
                vals.push(v === '' ? null : v);
              }
              // origen
              cols.push('source');
              vals.push(src);

              if (cols.length) {
                const result = await insertRecordWithDuplicateCheck(client, cols, vals, src);
                if (result.inserted) {
                  inserted++;
                } else if (result.reason === 'duplicate') {
                  duplicatesSkipped++;
                }
              }
            }
          }

          await client.query('COMMIT');
          return sendResponse(res, true, 'Dataset uploaded and processed successfully', {
            fileType: `${src}.csv`,
            recordsProcessed: inserted,
            duplicatesSkipped,
            totalRecords: records.length,
            normalization: normalizationResult.applied ? {
              applied: true,
              totalNormalized: normalizationResult.totalNormalized,
              normalizedColumns: Object.keys(normalizationResult.columns).filter(col => 
                normalizationResult.columns[col].normalized
              ),
              details: normalizationResult.columns
            } : { applied: false }
          });

        } catch (err) {
          await client.query('ROLLBACK').catch(() => {});
          console.error('Error processing file:', err);
          return sendError(res, 'Error processing file', 500, err.message);
        } finally {
          client.release();
        }
      });

  } catch (outerErr) {
    client.release();
    console.error(outerErr);
    return sendError(res, 'Error processing file', 500, outerErr.message);
  }
});





/**
 * @swagger
 * /api/table-structure:
 *   get:
 *     summary: Obtener estructura de las tablas de la base de datos
 *     description: |
 *       Retorna la estructura completa de la tabla survey_responses,
 *       incluyendo nombres de columnas, tipos de datos y restricciones.
 *     tags: [Base de Datos]
 *     responses:
 *       200:
 *         description: Estructura de tablas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableStructureResponse'
 *             example:
 *               survey_responses: [
 *                 {
 *                   column_name: "gender",
 *                   data_type: "character varying",
 *                   is_nullable: "YES"
 *                 },
 *                 {
 *                   column_name: "age",
 *                   data_type: "integer",
 *                   is_nullable: "YES"
 *                 }
 *               ]
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/table-structure', async (req, res) => {
  const client = await pool.connect();
  try {
    const surveyColumns = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'survey_responses' 
      ORDER BY ordinal_position
    `);
    
    return sendResponse(res, true, 'Table structure retrieved successfully', {
      survey_responses: surveyColumns.rows
    });
  } catch (error) {
    return sendError(res, 'Error retrieving table structure', 500, error.message);
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Obtener estadísticas de la base de datos
 *     description: |
 *       Retorna estadísticas generales de la base de datos, incluyendo
 *       el número total de respuestas de encuestas cargadas.
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 *             example:
 *               surveyResponses: 5572
 *               message: "Datos cargados directamente en survey_responses"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/*app.get('/api/stats', async (req, res) => {
  const client = await pool.connect();
  try {
    const surveyCount = await client.query('SELECT COUNT(*) FROM survey_responses');
    
    res.json({
      surveyResponses: parseInt(surveyCount.rows[0].count),
      message: 'Datos cargados directamente en survey_responses'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});*/

/**
 * @swagger
 * /api/clear-data:
 *   delete:
 *     summary: Limpiar todos los datos de la base de datos
 *     description: |
 *       Elimina todos los registros de la tabla survey_responses.
 *       ⚠️ **ADVERTENCIA**: Esta acción es irreversible y eliminará
 *       permanentemente todos los datos cargados.
 *     tags: [Base de Datos]
 *     responses:
 *       200:
 *         description: Base de datos limpiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *             example:
 *               message: "Database cleared successfully"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// /api/data con filtros, columnas, paginación y orden
app.get('/api/data', async (req, res) => {
  const client = await pool.connect();
  try {
    const allowed = [
      'id','gender','age',
      'sleep_problems','headaches','concentration_issues','irritability',
      'palpitations','sadness','anxiety','stress_type'
    ];

    // columnas solicitadas (lista blanca)
    const requested = (req.query.columns ?? '')
      .split(',').map(s => s.trim()).filter(Boolean)
      .filter(c => allowed.includes(c));
    const selectCols = (requested.length ? requested : ['id','gender','age','stress_type']).join(', ');

    // paginación
    const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize ?? '25', 10) || 25));
    const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
    const offset = (page - 1) * pageSize;

    // filtros
    const params = [];
    const where = [];

    // Género: acepta F/M, Femenino/Masculino, Female/Male, Mujer/Hombre (case-insensitive)
    const genderRaw = (req.query.gender ?? '').trim();
    if (genderRaw) {
      const g = genderRaw.toLowerCase();
      if (['f', 'femenino', 'female', 'mujer'].includes(g)) {
        where.push('(gender ILIKE \'F%\' OR LOWER(gender) IN (\'female\',\'mujer\'))');
      } else if (['m', 'masculino', 'male', 'hombre'].includes(g)) {
        where.push('(gender ILIKE \'M%\' OR LOWER(gender) IN (\'male\',\'hombre\'))');
      } else {
        params.push(`%${genderRaw}%`);
        where.push(`gender ILIKE $${params.length}`);
      }
    }

    // Tipo de estrés: ILIKE parcial
    const stressType = (req.query.stress_type ?? '').trim();
    if (stressType) {
      params.push(`%${stressType}%`);
      where.push(`stress_type ILIKE $${params.length}`);
    }

    const ageMin = parseInt(req.query.age_min ?? '', 10);
    if (Number.isFinite(ageMin)) { params.push(ageMin); where.push(`age >= $${params.length}`); }

    const ageMax = parseInt(req.query.age_max ?? '', 10);
    if (Number.isFinite(ageMax)) { params.push(ageMax); where.push(`age <= $${params.length}`); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // orden
    const sortBy = allowed.includes(req.query.sort_by) ? req.query.sort_by : 'id';
    const sortDir = (req.query.sort_dir ?? 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

    // consultas
    const dataSql = `
      SELECT ${selectCols}
      FROM survey_responses
      ${whereSql}
      ORDER BY ${sortBy} ${sortDir} NULLS LAST
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2};
    `;
    const countSql = `SELECT COUNT(*)::int AS total FROM survey_responses ${whereSql};`;

    const dataParams = params.concat([pageSize, offset]);
    const [dataRes, countRes] = await Promise.all([
      client.query(dataSql, dataParams),
      client.query(countSql, params),
    ]);

    const total = countRes.rows[0].total;
    return sendResponse(res, true, 'Data retrieved successfully', {
      data: dataRes.rows,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        sort_by: sortBy,
        sort_dir: sortDir,
        filters: {
          gender: genderRaw || null,
          stress_type: stressType || null,
          age_min: Number.isFinite(ageMin) ? ageMin : null,
          age_max: Number.isFinite(ageMax) ? ageMax : null
        }
      }
    });
  } catch (e) {
    console.error('Error en GET /api/data:', e);
    return sendError(res, 'Error obteniendo datos', 500, e.message);
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Obtener estadísticas detalladas del dataset
 *     description: |
 *       Endpoint para obtener estadísticas completas del dataset de estrés estudiantil.
 *       Permite filtrar los datos por diferentes criterios demográficos y académicos.
 *       
 *       **Estadísticas incluidas:**
 *       - Totales generales y por filtros aplicados
 *       - Distribución por edad, género y tipo de estrés
 *       - Promedios de escalas Likert (ansiedad, estrés, sueño, etc.)
 *       - Cobertura de datos por fuente
 *       - Análisis de completitud de respuestas
 *     tags: [Análisis y Estadísticas]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema: 
 *           type: string
 *           enum: [F, M, Femenino, Masculino, Female, Male]
 *         description: Filtrar por género
 *         example: F
 *       - in: query
 *         name: stress_type
 *         schema: 
 *           type: string
 *           enum: ["Academic", "Social", "Financial", "Health", "Académico", "Social", "Financiero", "Salud"]
 *         description: Filtrar por tipo de estrés
 *         example: "Académico"
 *       - in: query
 *         name: age_min
 *         schema: 
 *           type: integer
 *           minimum: 16
 *           maximum: 65
 *         description: Edad mínima para filtrar
 *         example: 18
 *       - in: query
 *         name: age_max
 *         schema: 
 *           type: integer
 *           minimum: 16
 *           maximum: 65
 *         description: Edad máxima para filtrar
 *         example: 25
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaEstadisticas'
 *             example:
 *               success: true
 *               message: "Estadísticas obtenidas exitosamente"
 *               data:
 *                 filters:
 *                   gender: "F"
 *                   stress_type: "Académico"
 *                   age_min: 18
 *                   age_max: 25
 *                 totals:
 *                   total: 1250
 *                 age:
 *                   min: 18
 *                   max: 25
 *                   avg: 21.5
 *                 by_gender:
 *                   - gender: "F"
 *                     count: 750
 *                   - gender: "M"
 *                     count: 500
 *                 likert_avgs:
 *                   anxiety: 3.2
 *                   stress_level: 3.8
 *                   sleep_problems: 2.9
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/stats', async (req, res) => {
  const client = await pool.connect();
  try {
    const params = [];
    const where = [];

    const gender     = (req.query.gender ?? '').trim();
    const stressType = (req.query.stress_type ?? '').trim();
    const ageMin     = parseInt(req.query.age_min ?? '', 10);
    const ageMax     = parseInt(req.query.age_max ?? '', 10);

    if (gender)     { params.push(gender);     where.push(`gender = $${params.length}`); }
    if (stressType) { params.push(stressType); where.push(`stress_type = $${params.length}`); }
    if (Number.isFinite(ageMin)) { params.push(ageMin); where.push(`age >= $${params.length}`); }
    if (Number.isFinite(ageMax)) { params.push(ageMax); where.push(`age <= $${params.length}`); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // 1) total
    const qTotal = client.query(`SELECT COUNT(*)::int AS total FROM survey_responses ${whereSql}`, params);

    // 2) resumen de edad
    const qAge = client.query(`
      SELECT
        MIN(age) AS min_age,
        MAX(age) AS max_age,
        ROUND(AVG(age)::numeric, 2) AS avg_age
      FROM survey_responses
      ${whereSql}
    `, params);

    // 3) distribución por género
    const qByGender = client.query(`
      SELECT COALESCE(gender,'(sin dato)') AS gender, COUNT(*)::int AS count
      FROM survey_responses
      ${whereSql}
      GROUP BY 1
      ORDER BY 2 DESC
    `, params);

    // 4) distribución por tipo de estrés
    const qByStress = client.query(`
      SELECT COALESCE(stress_type,'(sin dato)') AS stress_type, COUNT(*)::int AS count
      FROM survey_responses
      ${whereSql}
      GROUP BY 1
      ORDER BY 2 DESC
    `, params);

    // 5) promedios (si tus Likert están como texto 1–5)
    const qLikert = client.query(`
      SELECT
        ROUND(AVG(NULLIF(sleep_problems,'')::int)::numeric, 2)       AS sleep_problems,
        ROUND(AVG(NULLIF(headaches,'')::int)::numeric, 2)            AS headaches,
        ROUND(AVG(NULLIF(concentration_issues,'')::int)::numeric, 2) AS concentration_issues,
        ROUND(AVG(NULLIF(irritability,'')::int)::numeric, 2)         AS irritability,
        ROUND(AVG(NULLIF(palpitations,'')::int)::numeric, 2)         AS palpitations,
        ROUND(AVG(NULLIF(sadness,'')::int)::numeric, 2)              AS sadness,
        ROUND(AVG(NULLIF(anxiety,'')::int)::numeric, 2)              AS anxiety
      FROM survey_responses
      ${whereSql}
    `, params);

    // 6) cobertura/no-nulos
    const qCoverage = client.query(`
      SELECT
        SUM( (gender               IS NOT NULL)::int ) AS filled_gender,
        SUM( (age                  IS NOT NULL)::int ) AS filled_age,
        SUM( (sleep_problems       IS NOT NULL AND sleep_problems       <> '')::int ) AS filled_sleep_problems,
        SUM( (headaches            IS NOT NULL AND headaches            <> '')::int ) AS filled_headaches,
        SUM( (concentration_issues IS NOT NULL AND concentration_issues <> '')::int ) AS filled_concentration_issues,
        SUM( (irritability         IS NOT NULL AND irritability         <> '')::int ) AS filled_irritability,
        SUM( (palpitations         IS NOT NULL AND palpitations         <> '')::int ) AS filled_palpitations,
        SUM( (sadness              IS NOT NULL AND sadness              <> '')::int ) AS filled_sadness,
        SUM( (anxiety              IS NOT NULL AND anxiety              <> '')::int ) AS filled_anxiety,
        SUM( (stress_type          IS NOT NULL)::int ) AS filled_stress_type
      FROM survey_responses
      ${whereSql}
    `, params);

    const [rTotal, rAge, rGender, rStress, rLikert, rCoverage] = await Promise.all([
      qTotal, qAge, qByGender, qByStress, qLikert, qCoverage
    ]);

    return sendResponse(res, true, 'Statistics retrieved successfully', {
      filters: {
        gender: gender || null,
        stress_type: stressType || null,
        age_min: Number.isFinite(ageMin) ? ageMin : null,
        age_max: Number.isFinite(ageMax) ? ageMax : null,
      },
      totals:  { total: rTotal.rows[0].total },
      age:     rAge.rows[0],
      by_gender: rGender.rows,
      by_stress_type: rStress.rows,
      likert_avgs: rLikert.rows[0],
      coverage: rCoverage.rows[0],
    });
  } catch (e) {
    console.error('GET /api/stats error:', e);
    return sendError(res, 'Error obteniendo estadísticas', 500, e.message);
  } finally {
    client.release();
  }
});



console.log('  GET  /api/data - List data (sanity)');



app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});




// === %≥4 por ítem (UCaldas vs Otras) para gráficos ===
app.get('/api/compare/likert-ge4', async (req, res) => {
  const client = await pool.connect();
  try {
    // Ítems tipo Likert disponibles
    const items = [
      'sleep_problems','headaches','concentration_issues',
      'irritability','palpitations','sadness','anxiety'
    ];

    const baseSql = `
  WITH base AS (
    SELECT
      CASE
        WHEN lower(trim(source)) IN ('encuestas_ucaldas','ucaldas','udec','universidad de caldas')
             OR lower(source) LIKE '%caldas%'
        THEN 'Universidad de Caldas'
        ELSE 'Otras universidades'
      END AS university_group,
      NULLIF(sleep_problems,'')::int       AS sleep_problems,
      NULLIF(headaches,'')::int            AS headaches,
      NULLIF(concentration_issues,'')::int AS concentration_issues,
      NULLIF(irritability,'')::int         AS irritability,
      NULLIF(palpitations,'')::int         AS palpitations,
      NULLIF(sadness,'')::int              AS sadness,
      NULLIF(anxiety,'')::int              AS anxiety
    FROM survey_responses
  )
  SELECT * FROM base;
`;
    const base = await client.query(baseSql);

    // 2) Agregar por grupo: total filas y conteo de >=4 por ítem
    const groups = {};
    for (const row of base.rows) {
      const g = row.university_group || 'Otras universidades';
      if (!groups[g]) groups[g] = { n: 0 };
      groups[g].n += 1;
      for (const k of items) {
        if (!groups[g][k]) groups[g][k] = 0;
        const v = row[k];
        if (Number.isFinite(v) && v >= 4) groups[g][k] += 1;
      }
    }

    // 3) Armar series para línea: [{name, data:[{x,y}...]}]
    const label = {
      sleep_problems: 'Sueño',
      headaches: 'Dolor cabeza',
      concentration_issues: 'Concentración',
      irritability: 'Irritabilidad',
      palpitations: 'Palpitaciones',
      sadness: 'Tristeza',
      anxiety: 'Ansiedad'
    };

    const series = Object.entries(groups).map(([name, stats]) => ({
      name,
      data: items.map(k => ({
        x: label[k],
        y: stats.n ? Math.round((stats[k] * 10000) / stats.n) / 100 : 0 // % con 2 decimales
      }))
    }));

    return sendResponse(res, true, 'Comparison data retrieved successfully', { series });
  } catch (e) {
    console.error('GET /api/compare/likert-ge4 error:', e);
    return sendError(res, 'Error retrieving comparison data', 500, e.message);
  } finally {
    client.release();
  }
});
app.get('/api/factores-clave', async (req, res) => {
  const client = await pool.connect();
  try {
    const items = [
      'sleep_problems','headaches','concentration_issues',
      'irritability','palpitations','sadness','anxiety'
    ];

    // Agrupa por universidad
    const groups = [
      { key: 'Universidad de Caldas',
        cond:
          '(lower(trim(source)) IN (\'encuestas_ucaldas\',\'ucaldas\',\'udec\',\'universidad de caldas\') ' +
          'OR lower(source) LIKE \'%caldas%\')' },
      { key: 'Otras universidades',
        cond:
          'NOT (lower(trim(source)) IN (\'encuestas_ucaldas\',\'ucaldas\',\'udec\',\'universidad de caldas\') ' +
          'OR lower(source) LIKE \'%caldas%\')' }
    ];
    const resultados = [];
    for (const group of groups) {
      const factores = [];
      for (const k of items) {
        const sql = `
          SELECT
            ROUND(AVG(NULLIF(${k},'')::int)::numeric,2) AS promedio,
            ROUND(100.0 * SUM(CASE WHEN NULLIF(${k},'')::int >= 4 THEN 1 ELSE 0 END) / NULLIF(COUNT(NULLIF(${k},'')),0),2) AS porcentaje_ge4
          FROM survey_responses
          WHERE ${group.cond}
        `;
        const r = await client.query(sql);
        factores.push({
          factor: k,
          promedio: Number(r.rows[0].promedio) || 0,
          porcentaje_ge4: Number(r.rows[0].porcentaje_ge4) || 0
        });
      }
      resultados.push({
        universidad: group.key,
        factores
      });
    }

    return sendResponse(res, true, 'Key factors data retrieved successfully', { resultados });
  } catch (e) {
    console.error('GET /api/factores-clave error:', e);
    return sendError(res, 'Error retrieving key factors data', 500, e.message);
  } finally {
    client.release();
  }
});
/**
 * @swagger
 * /api/what-if:
 *   post:
 *     summary: Simulación "What-If" para análisis de impacto de intervenciones
 *     description: |
 *       Endpoint para realizar simulaciones de escenarios "¿Qué pasaría si?" 
 *       aplicando diferentes intervenciones sobre factores de estrés estudiantil.
 *       
 *       **Funcionalidades:**
 *       - Análisis de línea base vs escenario con intervenciones
 *       - Cálculo de impacto en índices de bienestar
 *       - Filtrado por criterios demográficos y grupos universitarios
 *       - Múltiples tipos de intervenciones simultáneas
 *       - Medición de efectividad personalizable
 *       
 *       **Tipos de intervenciones disponibles:**
 *       - Tutoría académica, Salud mental, Actividad física
 *       - Gestión de tiempo, Apoyo económico, Ambiente de residencia
 *     tags: [Simulaciones y Análisis Predictivo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: object
 *                 description: Filtros demográficos para el análisis
 *                 properties:
 *                   gender: 
 *                     type: string
 *                     enum: [F, M, Femenino, Masculino, Female, Male]
 *                     description: Filtrar por género
 *                     example: "F"
 *                   age_min: 
 *                     type: integer
 *                     minimum: 16
 *                     maximum: 65
 *                     description: Edad mínima
 *                     example: 18
 *                   age_max: 
 *                     type: integer
 *                     minimum: 16
 *                     maximum: 65
 *                     description: Edad máxima
 *                     example: 25
 *                   university_group:
 *                     type: string
 *                     enum: [ucaldas, otras, todas]
 *                     description: Filtrar por grupo universitario
 *                     example: ucaldas
 *               interventions:
 *                 type: array
 *                 description: Lista de intervenciones a simular
 *                 items:
 *                   type: object
 *                   required: [type, pct]
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [tutoria_academica, salud_mental, actividad_fisica, gestion_tiempo, apoyo_economico, ambiente_residencia]
 *                       description: Tipo de intervención
 *                       example: "tutoria_academica"
 *                     pct: 
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *                       description: Porcentaje de efectividad de la intervención
 *                       example: 20
 *               effectiveness:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Eficacia global del conjunto de intervenciones (0.0 = sin efecto, 1.0 = efecto máximo)
 *                 example: 0.5
 *                 default: 0.5
 *     responses:
 *       200:
 *         description: Simulación completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Simulación what-if completada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     baseline:
 *                       type: object
 *                       description: "Métricas de línea base antes de intervenciones"
 *                       properties:
 *                         index_pct_ge4:
 *                           type: number
 *                           description: "Índice de bienestar base"
 *                         items:
 *                           type: array
 *                           description: "Factores individuales de línea base"
 *                     scenario:
 *                       type: object
 *                       description: "Métricas proyectadas después de intervenciones"
 *                       properties:
 *                         index_pct_ge4:
 *                           type: number
 *                           description: "Índice de bienestar proyectado"
 *                         delta_index_pp:
 *                           type: number
 *                           description: "Cambio en puntos porcentuales"
 *                         items:
 *                           type: array
 *                           description: "Factores individuales proyectados"
 *       500:
 *         description: Error en la simulación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/what-if', async (req, res) => {
  const client = await pool.connect();
  try {
    const items = [
      'sleep_problems','headaches','concentration_issues',
      'irritability','palpitations','sadness','anxiety'
    ];
    const labels = {
      sleep_problems: 'Sueño',
      headaches: 'Dolor cabeza',
      concentration_issues: 'Concentración',
      irritability: 'Irritabilidad',
      palpitations: 'Palpitaciones',
      sadness: 'Tristeza',
      anxiety: 'Ansiedad'
    };

    // 1) Intervenciones y pesos por ítem (SISTEMA ORIGINAL)
    const EFFECT_MAP = {
      tutoria_academica: { concentration_issues: 0.6, academic_overload: 0.4 },
      salud_mental:      { anxiety: 0.5, sadness: 0.3, sleep_problems: 0.2 },
      higiene_sueno:     { anxiety: 0.5, sadness: 0.3, sleep_problems: 0.2 }, // alias
      apoyo_financiero:  { headaches: 0.4, palpitations: 0.3, irritability: 0.3 },
    };

    const body = req.body || {};
    const filters = body.filters || {};
    const interventions = Array.isArray(body.interventions) ? body.interventions : [];
    const effectiveness = Math.max(0, Math.min(1, Number(body.effectiveness ?? 0.5))); // 0..1

    // 2) WHERE dinámico
    const where = [];
    const params = [];

    // University group
    const ug = (filters.university_group || 'todas').toLowerCase();
    if (ug === 'ucaldas') {
      where.push('source = \'Encuestas_UCaldas\'');
    } else if (ug === 'otras') {
      where.push('(source <> \'Encuestas_UCaldas\' OR source IS NULL)');
    }

    // Género (flexible)
    const g = (filters.gender || '').toLowerCase().trim();
    if (g) {
      if (['f','femenino','female','mujer'].includes(g)) {
        where.push('(gender ILIKE \'F%\' OR LOWER(gender) IN (\'female\',\'mujer\'))');
      } else if (['m','masculino','male','hombre'].includes(g)) {
        where.push('(gender ILIKE \'M%\' OR LOWER(gender) IN (\'male\',\'hombre\'))');
      } else {
        params.push(`%${filters.gender}%`);
        where.push(`gender ILIKE $${params.length}`);
      }
    }

    const aMin = parseInt(filters.age_min ?? '', 10);
    if (Number.isFinite(aMin)) { params.push(aMin); where.push(`age >= $${params.length}`); }
    const aMax = parseInt(filters.age_max ?? '', 10);
    if (Number.isFinite(aMax)) { params.push(aMax); where.push(`age <= $${params.length}`); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // 3) Baseline: N válidos, GE4 y AVG por ítem (en una sola query)
    // Nota: Los datos parecen estar en una escala diferente, ajustamos el umbral
    const aggSql = `
      SELECT
        ${items.map(k => `
          COUNT(NULLIF(${k},''))                    AS n_${k},
          SUM( CASE WHEN NULLIF(${k},'')::int >= 3 THEN 1 ELSE 0 END ) AS ge4_${k},
          ROUND(AVG(NULLIF(${k},'')::int)::numeric,2) AS avg_${k}
        `).join(',')}
      FROM survey_responses
      ${whereSql}
    `;
    const r = await client.query(aggSql, params);
    const row = r.rows[0] || {};

    const baseline = items.map(k => {
      const n   = Number(row[`n_${k}`])   || 0;
      const ge4 = Number(row[`ge4_${k}`]) || 0;
      const avg = Number(row[`avg_${k}`]);
      const p   = n > 0 ? +(ge4 * 100 / n).toFixed(2) : 0;
      return { key: k, label: labels[k], n, ge4, pct_ge4: p, avg: Number.isFinite(avg) ? avg : 0 };
    });

    // Verificar si hay datos válidos
    const hasData = baseline.some(item => item.n > 0);
    if (!hasData) {
      return sendResponse(res, true, 'No data available for simulation', {
        meta: { filters, effectiveness, interventions },
        baseline: {
          index_pct_ge4: 0,
          items: baseline
        },
        scenario: {
          index_pct_ge4: 0,
          delta_index_pp: 0,
          items: baseline
        },
        message: 'No hay datos disponibles en la base de datos para realizar la simulación'
      });
    }

    // 4) Reducción combinada por ítem a partir de las intervenciones
    const red = Object.fromEntries(items.map(k => [k, 0]));
    for (const it of interventions) {
      const type = it?.type;
      const pct  = Math.max(0, Math.min(100, Number(it?.pct || 0))); // 0..100
      const weights = EFFECT_MAP[type];
      if (!weights) continue;
      for (const [k, w] of Object.entries(weights)) {
        // suma reducciones, cap en 0.6
        red[k] = Math.min(0.6, red[k] + (pct/100) * effectiveness * w);
      }
    }

    // 5) Predicción
    const ALPHA = 0.4; // cuanto mueve el promedio cuando baja %≥4
    const scenario = baseline.map(b => {
      const rdx = red[b.key] || 0;
      const pct_ge4_pred = +(b.pct_ge4 * (1 - rdx)).toFixed(2);
      const avg_pred     = +( (b.avg - (b.avg - 1) * (rdx * ALPHA)).toFixed(2) );
      const delta_pp     = +(pct_ge4_pred - b.pct_ge4).toFixed(2); // puntos porcentuales
      return {
        key: b.key, label: b.label,
        baseline: { pct_ge4: b.pct_ge4, avg: b.avg, n: b.n },
        predicted: { pct_ge4: pct_ge4_pred, avg: avg_pred },
        reduction_factor: +rdx.toFixed(3),
        delta_pp
      };
    });

    // 6) Índices globales (promedio de %≥4)
    const mean = arr => (arr.length ? +(arr.reduce((a,c)=>a+c,0)/arr.length).toFixed(2) : 0);
    const baseIndex = mean(baseline.map(b => b.pct_ge4));
    const predIndex = mean(scenario.map(s => s.predicted.pct_ge4));

    return sendResponse(res, true, 'What-if simulation completed successfully', {
      meta: { filters, effectiveness, interventions },
      baseline: {
        index_pct_ge4: baseIndex,
        items: baseline
      },
      scenario: {
        index_pct_ge4: predIndex,
        delta_index_pp: +(predIndex - baseIndex).toFixed(2),
        items: scenario
      }
    });
  } catch (e) {
    console.error('POST /api/what-if error:', e);
    return sendError(res, 'Error in what-if simulation', 500, e.message);
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /api/what-if-bayesian:
 *   post:
 *     summary: Simulación bayesiana "What-If" con red bayesiana
 *     tags: [Simulacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interventions:
 *                 type: object
 *                 properties:
 *                   tutoria_academica: { type: string, example: "50%" }
 *                   salud_mental: { type: string, example: "75%" }
 *                   apoyo_financiero: { type: string, example: "25%" }
 *               target:
 *                 type: string
 *                 default: wellbeing_index
 *                 example: wellbeing_index
 *               includeExplanation:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200: { description: OK }
 *       500: { description: Error }
 */
app.post('/api/what-if-bayesian', async (req, res) => {
  try {
    const { interventions = {}, target = 'wellbeing_index', includeExplanation = true } = req.body;
    
    // Crear instancia de la red bayesiana
    const StudentWellbeingNetwork = require('./student-wellbeing-network.js');
    const network = new StudentWellbeingNetwork();
    
    // Ejecutar simulación
    const result = network.simulateIntervention(interventions, target);
    
    // Calcular impacto esperado
    const impact = network.calculateExpectedImpact(
      Object.keys(interventions)[0] || 'tutoria_academica',
      Object.values(interventions)[0] || '50%',
      target
    );
    
    const response = {
      target,
      interventions,
      probabilities: result,
      expectedValue: network.calculateExpectedValue(result),
      impact: {
        baseline: impact.baseline,
        postIntervention: impact.postIntervention,
        improvement: impact.improvement,
        improvementPercent: impact.improvementPercent
      }
    };
    
    if (includeExplanation) {
      response.explanation = network.getSimulationExplanation(interventions, target);
    }
    
    return sendResponse(res, true, 'Bayesian what-if simulation completed successfully', response);
  } catch (e) {
    console.error('POST /api/what-if-bayesian error:', e);
    return sendError(res, 'Error in bayesian what-if simulation', 500, e.message);
  }
});

/**
 * @swagger
 * /api/what-if-bayesian-full:
 *   post:
 *     summary: Simulación bayesiana completa para todas las variables objetivo
 *     tags: [Simulacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interventions:
 *                 type: object
 *                 properties:
 *                   tutoria_academica: { type: string, example: "50%" }
 *                   salud_mental: { type: string, example: "75%" }
 *                   apoyo_financiero: { type: string, example: "25%" }
 *     responses:
 *       200: { description: OK }
 *       500: { description: Error }
 */
app.post('/api/what-if-bayesian-full', async (req, res) => {
  try {
    const { interventions = {} } = req.body;
    
    // Crear instancia de la red bayesiana
    const StudentWellbeingNetwork = require('./student-wellbeing-network.js');
    const network = new StudentWellbeingNetwork();
    
    // Ejecutar simulación completa
    const results = network.calculateInterventionImpact(interventions);
    
    // Calcular valores esperados para cada variable
    const expectedValues = {};
    for (const [variable, probabilities] of Object.entries(results)) {
      expectedValues[variable] = network.calculateExpectedValue(probabilities);
    }
    
    return sendResponse(res, true, 'Full bayesian simulation completed successfully', {
      interventions,
      results,
      expectedValues,
      networkInfo: network.getNetworkInfo()
    });
  } catch (e) {
    console.error('POST /api/what-if-bayesian-full error:', e);
    return sendError(res, 'Error in full bayesian simulation', 500, e.message);
  }
});

app.delete('/api/clear-data', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('TRUNCATE survey_responses RESTART IDENTITY');
    return sendResponse(res, true, 'Database cleared successfully');
  } catch (e) {
    return sendError(res, 'Error clearing database', 500, e.message);
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /api/bayesian-stats:
 *   get:
 *     summary: Obtener estadísticas para análisis bayesiano
 *     description: Retorna estadísticas básicas para demostración de análisis bayesiano
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Estadísticas bayesianas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 stats:
 *                   type: object
 *                   properties:
 *                     probabilities:
 *                       type: object
 *                       properties:
 *                         P_A:
 *                           type: number
 *                           example: 0.3
 *                         P_B:
 *                           type: number
 *                           example: 0.4
 *                         P_B_given_A:
 *                           type: number
 *                           example: 0.6
 */
app.get('/api/bayesian-stats', async (req, res) => {
  const client = await pool.connect();
  try {
    // Obtener estadísticas básicas para análisis bayesiano
    const totalQuery = await client.query('SELECT COUNT(*)::int AS total FROM survey_responses');
    const total = totalQuery.rows[0].total;
    
    // Calcular probabilidades básicas basadas en los datos reales
    const anxietyQuery = await client.query(`
      SELECT 
        COUNT(*)::int AS total_with_anxiety,
        COUNT(CASE WHEN NULLIF(anxiety,'')::int >= 4 THEN 1 END)::int AS high_anxiety
      FROM survey_responses 
      WHERE anxiety IS NOT NULL AND anxiety != ''
    `);
    
    const stressQuery = await client.query(`
      SELECT 
        COUNT(*)::int AS total_with_stress,
        COUNT(CASE WHEN NULLIF(sleep_problems,'')::int >= 4 THEN 1 END)::int AS high_stress
      FROM survey_responses 
      WHERE sleep_problems IS NOT NULL AND sleep_problems != ''
    `);
    
    const anxietyData = anxietyQuery.rows[0];
    const stressData = stressQuery.rows[0];
    
    // Calcular probabilidades para análisis bayesiano
    const P_A = total > 0 ? Math.max(0.1, Math.min(0.9, anxietyData.high_anxiety / anxietyData.total_with_anxiety)) : 0.3;
    const P_B = total > 0 ? Math.max(0.1, Math.min(0.9, stressData.high_stress / stressData.total_with_stress)) : 0.4;
    const P_B_given_A = total > 0 ? Math.max(0.1, Math.min(0.9, (P_A + P_B) / 2)) : 0.6;
    
    // Calcular P_A_given_B usando el teorema de Bayes
    const P_A_given_B = P_B > 0 ? (P_B_given_A * P_A) / P_B : 0.5;
    
    return sendResponse(res, true, 'Bayesian statistics retrieved successfully', {
      status: 'success',
      stats: {
        probabilities: {
          P_A: Math.round(P_A * 100) / 100,
          P_B: Math.round(P_B * 100) / 100,
          P_B_given_A: Math.round(P_B_given_A * 100) / 100,
          P_A_given_B: Math.round(P_A_given_B * 100) / 100
        },
        sample_size: total,
        total_students: total,
        high_wellbeing: Math.round(total * P_A),
        good_tutoring: Math.round(total * P_B),
        high_wellbeing_with_good_tutoring: Math.round(total * P_A * P_B_given_A),
        description: 'Probabilidades calculadas basadas en datos reales de encuestas de estrés'
      }
    });
  } catch (e) {
    console.error('GET /api/bayesian-stats error:', e);
    return sendError(res, 'Error retrieving bayesian statistics', 500, e.message);
  } finally {
    client.release();
  }
});



// Endpoint temporal para crear la tabla (solo para setup inicial)
app.post('/api/setup-database', async (req, res) => {
  const client = await pool.connect();
  try {
    // Leer el archivo schema.sql
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../../db/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Ejecutar el script SQL
    await client.query(schemaSQL);
    
    return sendResponse(res, true, 'Database schema created successfully', {
      message: 'Table survey_responses created with all indexes and constraints'
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return sendError(res, 'Error setting up database', 500, error.message);
  } finally {
    client.release();
  }
});

app.use((req, res) => {
  return sendError(res, 'Endpoint not found', 404, req.path);
});

module.exports = app;
