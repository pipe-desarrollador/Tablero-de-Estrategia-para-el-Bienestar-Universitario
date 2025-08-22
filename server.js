const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const csv = require('csv-parser');
const stream = require('stream');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

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
  res.sendFile(__dirname + '/upload.html');
});

/**
 * @swagger
 * /api/upload-dataset:
 *   post:
 *     summary: Cargar y procesar archivo CSV de estrés estudiantil
 *     description: |
 *       Endpoint para cargar archivos CSV de datasets de estrés estudiantil.
 *       Soporta dos formatos:
 *       - **Stress_Dataset.csv**: Con columnas como Gender, Age, preguntas de estrés
 *       - **StressLevelDataset.csv**: Con columnas como anxiety_level, stress_level
 *       
 *       Los datos se procesan automáticamente y se insertan en la tabla survey_responses.
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
 *             example:
 *               message: "Dataset uploaded and processed successfully"
 *               fileType: "Stress_Dataset.csv"
 *               recordsProcessed: 1500
 *       400:
 *         description: Error en la solicitud (archivo no proporcionado)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "No file part in the request"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Error processing file: [detalles del error]"
 */
app.post('/api/upload-dataset', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file part in the request' });
  }

  const client = await pool.connect();
  let records = [];

  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => records.push(data))
      .on('end', async () => {
        try {
          await client.query('BEGIN');

          // Detecta el tipo de archivo basado en las columnas disponibles
          const firstRow = records[0];
          let isStressDataset = false;
          let isStressLevelDataset = false;

          if (firstRow['Gender'] !== undefined && firstRow['Age'] !== undefined) {
            isStressDataset = true;
          } else if (firstRow['anxiety_level'] !== undefined && firstRow['stress_level'] !== undefined) {
            isStressLevelDataset = true;
          }

          console.log(`Detected file type: ${isStressDataset ? 'Stress_Dataset.csv' : isStressLevelDataset ? 'StressLevelDataset.csv' : 'Unknown'}`);

          for (const row of records) {
            if (isStressDataset) {
              // Procesa Stress_Dataset.csv - inserta directamente en survey_responses
              // Mapeo de columnas del CSV a las columnas de la tabla
              const columnMapping = {
                'Gender': 'gender',
                'Age': 'age',
                'Have you recently experienced stress in your life?': 'stress_experience',
                'Have you noticed a rapid heartbeat or palpitations?': 'palpitations',
                'Have you been dealing with anxiety or tension recently?': 'anxiety',
                'Do you face any sleep problems or difficulties falling asleep?': 'sleep_problems',
                'Have you been dealing with anxiety or tension recently?.1': 'anxiety_duplicate',
                'Have you been getting headaches more often than usual?': 'headaches',
                'Do you get irritated easily?': 'irritability',
                'Do you have trouble concentrating on your academic tasks?': 'concentration_issues',
                'Have you been feeling sadness or low mood?': 'sadness',
                'Have you been experiencing any illness or health issues?': 'illness',
                'Do you often feel lonely or isolated?': 'loneliness',
                'Do you feel overwhelmed with your academic workload?': 'academic_overload',
                'Are you in competition with your peers, and does it affect you?': 'competition',
                'Do you find that your relationship often causes you stress?': 'relationship_stress',
                'Are you facing any difficulties with your professors or instructors?': 'professor_difficulty',
                'Is your working environment unpleasant or stressful?': 'work_environment',
                'Do you struggle to find time for relaxation and leisure activities?': 'leisure_time',
                'Is your hostel or home environment causing you difficulties?': 'home_environment',
                'Do you lack confidence in your academic performance?': 'low_confidence_performance',
                'Do you lack confidence in your choice of academic subjects?': 'low_confidence_subjects',
                'Academic and extracurricular activities conflicting for you?': 'academic_conflict',
                'Do you attend classes regularly?': 'class_attendance',
                'Have you gained/lost weight?': 'weight_change',
                'Which type of stress do you primarily experience?': 'stress_type'
              };
              
              // Construir la consulta dinámicamente
              const columns = [];
              const values = [];
              let paramCount = 1;
              
              for (const [csvColumn, dbColumn] of Object.entries(columnMapping)) {
                if (row[csvColumn] !== undefined) {
                  columns.push(dbColumn);
                  values.push(row[csvColumn] || 0);
                  paramCount++;
                }
              }
              
              if (columns.length > 0) {
                const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
                const insertQuery = `INSERT INTO survey_responses (${columns.join(', ')}) VALUES (${placeholders})`;
                await client.query(insertQuery, values);
              }
              
            } else if (isStressLevelDataset) {
              // Procesa StressLevelDataset.csv - inserta directamente en survey_responses
              // Mapeo a las columnas reales de tu tabla
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
                'stress_level': 'stress_type'
              };
              
              // Construir la consulta dinámicamente
              const columns = [];
              const values = [];
              
              for (const [csvColumn, dbColumn] of Object.entries(columnMapping)) {
                if (row[csvColumn] !== undefined) {
                  columns.push(dbColumn);
                  values.push(row[csvColumn] || 0);
                }
              }
              
              if (columns.length > 0) {
                const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
                const insertQuery = `INSERT INTO survey_responses (${columns.join(', ')}) VALUES (${placeholders})`;
                await client.query(insertQuery, values);
              }
            }
          }

          await client.query('COMMIT');
          res.status(200).json({ 
            message: 'Dataset uploaded and processed successfully',
            fileType: isStressDataset ? 'Stress_Dataset.csv' : isStressLevelDataset ? 'StressLevelDataset.csv' : 'Unknown',
            recordsProcessed: records.length
          });
        } catch (error) {
          await client.query('ROLLBACK');
          console.error('Error processing file:', error);
          res.status(500).json({ error: error.message });
        } finally {
          client.release();
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
app.get('/api/stats', async (req, res) => {
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
});

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
app.delete('/api/clear-data', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM survey_responses');
    await client.query('COMMIT');
    
    res.json({ message: 'Database cleared successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Available endpoints:`);
  console.log(`  POST /api/upload-dataset - Upload CSV file`);
  console.log(`  GET  /api/stats - Get database statistics`);
  console.log(`  DELETE /api/clear-data - Clear database`);
  console.log(`  GET  /api-docs - Swagger API Documentation`);
});