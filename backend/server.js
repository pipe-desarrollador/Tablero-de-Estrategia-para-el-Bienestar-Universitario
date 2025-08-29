const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const csv = require('csv-parser');
const stream = require('stream');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const removeAccents = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const norm = (s='') =>
  removeAccents(String(s).replace(/^\ufeff/, '')).trim().toLowerCase().replace(/\s+/g,' ');

const detectSeparator = (buf) => {
  const head = buf.toString('utf8').split(/\r?\n/)[0] || '';
  const count = (ch) => (head.match(new RegExp(`\\${ch}`, 'g')) || []).length;
  const semis = count(';'), commas = count(','), tabs = count('\t');
  if (semis >= commas && semis >= tabs) return ';';
  if (commas >= tabs) return ',';
  return '\t';
};


const app = express();
const port = 3000;

console.log('Booting server from file:', __filename);
console.log('Working directory (cwd):', process.cwd());

// rutas de salud y depuración
app.get('/ping', (req, res) => res.send('pong'));
app.get('/_routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((m) => {
    if (m.route && m.route.path) {
      const methods = Object.keys(m.route.methods).join(',').toUpperCase();
      routes.push({ methods, path: m.route.path });
    }
  });
  res.json(routes);
});


// Servir archivos estáticos
app.use(express.static('.'));

// Configuración de la base de datos PostgreSQL
// Reemplaza los valores con los de tu configuración
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stress_db',
  password: 'admin123',
  port: 5432,
});

// Configuración de Multer para la carga de archivos
const upload = multer();

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Dataset de Estrés Estudiantil',
      version: '1.0.0',
      description: 'API para cargar y gestionar datasets de estrés estudiantil en PostgreSQL',
      contact: {
        name: 'Soporte Técnico',
        email: 'soporte@ejemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        UploadResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de confirmación'
            },
            fileType: {
              type: 'string',
              description: 'Tipo de archivo detectado (Stress_Dataset.csv o StressLevelDataset.csv)'
            },
            recordsProcessed: {
              type: 'integer',
              description: 'Número de registros procesados'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        StatsResponse: {
          type: 'object',
          properties: {
            surveyResponses: {
              type: 'integer',
              description: 'Número total de respuestas de encuestas'
            },
            message: {
              type: 'string',
              description: 'Mensaje informativo'
            }
          }
        },
        TableStructureResponse: {
          type: 'object',
          properties: {
            survey_responses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  column_name: {
                    type: 'string',
                    description: 'Nombre de la columna'
                  },
                  data_type: {
                    type: 'string',
                    description: 'Tipo de dato de la columna'
                  },
                  is_nullable: {
                    type: 'string',
                    description: 'Si la columna permite valores nulos'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./server.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// Lista de preguntas del archivo Stress_Dataset.csv
const preguntas = [
  "Have you recently experienced stress in your life?",
  "Have you noticed a rapid heartbeat or palpitations?",
  "Have you been dealing with anxiety or tension recently?",
  "Do you face any sleep problems or difficulties falling asleep?",
  "Have you been dealing with anxiety or tension recently?.1", // Nota: hay una columna duplicada
  "Have you been getting headaches more often than usual?",
  "Do you get irritated easily?",
  "Do you have trouble concentrating on your academic tasks?",
  "Have you been feeling sadness or low mood?",
  "Have you been experiencing any illness or health issues?",
  "Do you often feel lonely or isolated?",
  "Do you feel overwhelmed with your academic workload?",
  "Are you in competition with your peers, and does it affect you?",
  "Do you find that your relationship often causes you stress?",
  "Are you facing any difficulties with your professors or instructors?",
  "Is your working environment unpleasant or stressful?",
  "Do you struggle to find time for relaxation and leisure activities?",
  "Is your hostel or home environment causing you difficulties?",
  "Do you lack confidence in your academic performance?",
  "Do you lack confidence in your choice of academic subjects?",
  "Academic and extracurricular activities conflicting for you?",
  "Do you attend classes regularly?",
  "Have you gained/lost weight?",
  "Which type of stress do you primarily experience?"
];

// Lista de preguntas del archivo StressLevelDataset.csv
const preguntasStressLevel = [
  "anxiety_level",
  "self_esteem", 
  "mental_health_history",
  "depression",
  "headache",
  "blood_pressure",
  "sleep_quality",
  "breathing_problem",
  "noise_level",
  "living_conditions",
  "safety",
  "basic_needs",
  "academic_performance",
  "study_load",
  "teacher_student_relationship",
  "future_career_concerns",
  "social_support",
  "peer_pressure",
  "extracurricular_activities",
  "bullying",
  "stress_level"
];

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Endpoint raíz
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});


/**
 * @swagger
 * /api/upload-dataset:
 *   post:
 *     summary: Cargar y procesar archivo CSV de estrés estudiantil
 *     description: |
 *       Soporta tres formatos:
 *       - **Stress_Dataset.csv** (en inglés)
 *       - **StressLevelDataset.csv** (en inglés)
 *       - **Encuestas_UCaldas.csv** (en español)
 *       Los datos se insertan en la tabla `survey_responses`.
 *     tags: [Dataset]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV a procesar
 *     responses:
 *       200:
 *         description: Dataset cargado y procesado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Error en la solicitud (archivo no proporcionado o formato desconocido)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

app.post('/api/upload-dataset', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file part in the request' });
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
        mapHeaders: ({ header }) => norm(header), // normaliza cabeceras
      }))
      .on('data', (data) => records.push(data))
      .on('end', async () => {
        try {
          if (records.length === 0) {
            // error 400 si el CSV está vacío
            return res.status(400).json({ error: 'CSV vacío' });
          }

          await client.query('BEGIN');

          const firstRow = records[0] || {};
          let isStressDataset = false;
          let isStressLevelDataset = false;
          let isEncuestasUCaldas = false;

          // OJO: cabeceras ya están normalizadas por norm()
          if (firstRow['gender'] !== undefined && firstRow['age'] !== undefined) {
            isStressDataset = true;
          } else if (firstRow['anxiety_level'] !== undefined && firstRow['stress_level'] !== undefined) {
            isStressLevelDataset = true;
          } else {
            const headers = Object.keys(firstRow);
            const findHeader = (...keywords) =>
              headers.find(h => keywords.every(k => h.includes(k)));
            if (findHeader('genero') || findHeader('edad') || findHeader('tipo','estres')) {
              isEncuestasUCaldas = true;
            }
          }

          console.log(
            'Detected file type:',
            isStressDataset ? 'Stress_Dataset.csv'
            : isStressLevelDataset ? 'StressLevelDataset.csv'
            : isEncuestasUCaldas ? 'Encuestas_UCaldas.csv'
            : 'Unknown'
          );

          if (!isStressDataset && !isStressLevelDataset && !isEncuestasUCaldas) {
            // No hagas release aquí; deja que lo haga el finally
            await client.query('ROLLBACK');
            return res.status(400).json({
              error: `Formato de CSV no reconocido (sep="${sep}"). Verifica cabeceras/separador.`,
            });
          }

          for (const row of records) {
            if (isStressDataset) {
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
              if (cols.length) {
                const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
                await client.query(
                  `INSERT INTO survey_responses (${cols.join(',')}) VALUES (${placeholders})`,
                  vals
                );
              }

            } else if (isStressLevelDataset) {
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
              if (cols.length) {
                const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
                await client.query(
                  `INSERT INTO survey_responses (${cols.join(',')}) VALUES (${placeholders})`,
                  vals
                );
              }

            } else if (isEncuestasUCaldas) {
              // español con cabeceras largas (ya normalizadas por norm)
              const headers = Object.keys(firstRow);
              const findHeader = (...keywords) =>
                headers.find(h => keywords.every(k => h.includes(k)));

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

              if (cols.length) {
                const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
                await client.query(
                  `INSERT INTO survey_responses (${cols.join(',')}) VALUES (${placeholders})`,
                  vals
                );
              }
            }
          }

          // ✅ un solo COMMIT y una sola respuesta
          await client.query('COMMIT');
          return res.status(200).json({
            message: 'Dataset uploaded and processed successfully',
            fileType: isStressDataset
              ? 'Stress_Dataset.csv'
              : isStressLevelDataset
              ? 'StressLevelDataset.csv'
              : 'Encuestas_UCaldas.csv',
            recordsProcessed: records.length,
          });

        } catch (err) {
          await client.query('ROLLBACK').catch(() => {});
          console.error('Error processing file:', err);
          const status = err.httpStatus || 500;
          return res.status(status).json({ error: err.publicMessage || err.message });
        } finally {
          client.release();
        }
      });

  } catch (outerErr) {
    client.release();
    console.error(outerErr);
    return res.status(500).json({ error: outerErr.message });
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
    
    res.json({
      survey_responses: surveyColumns.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        where.push(`(gender ILIKE 'F%' OR LOWER(gender) IN ('female','mujer'))`);
      } else if (['m', 'masculino', 'male', 'hombre'].includes(g)) {
        where.push(`(gender ILIKE 'M%' OR LOWER(gender) IN ('male','hombre'))`);
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
    res.json({
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
    res.status(500).json({ message: 'Error obteniendo datos', error: e.message });
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Estadísticas del dataset (filtros opcionales)
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema: { type: string }
 *         example: F
 *       - in: query
 *         name: stress_type
 *         schema: { type: string }
 *         example: Académico
 *       - in: query
 *         name: age_min
 *         schema: { type: integer }
 *         example: 18
 *       - in: query
 *         name: age_max
 *         schema: { type: integer }
 *         example: 25
 *     responses:
 *       200: { description: OK }
 *       500: { description: Error }
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

    res.json({
      status: 'success',
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
    res.status(500).json({ status: 'error', message: 'Error obteniendo estadísticas', error: e.message });
  } finally {
    client.release();
  }
});



// (tu /api/stats ya lo tienes; si no, pega el que hicimos antes)

console.log(`  GET  /api/data - List data (sanity)`);


const path = require('path');
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});


app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Available endpoints:`);
  console.log(`  POST /api/upload-dataset - Upload CSV file`);
  console.log(`  GET  /api/stats - Get database statistics`);
  console.log(`  DELETE /api/clear-data - Clear database`);
  console.log(`  GET  /api-docs - Swagger API Documentation`);
});