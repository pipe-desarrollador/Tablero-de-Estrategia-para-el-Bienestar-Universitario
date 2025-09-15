// test-server-simple.js - Servidor de prueba sin dependencias externas
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Backend funcionando correctamente (servidor simple)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database_url: process.env.DATABASE_URL ? 'configured' : 'not configured',
    port: PORT,
    node_version: process.version
  });
});

app.get('/ping', (req, res) => res.send('pong from simple server'));

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint from simple server',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database_url: process.env.DATABASE_URL ? 'configured' : 'not configured'
  });
});

// API endpoints que necesita el frontend
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalStudents: 150,
      averageStress: 3.2,
      highStressPercentage: 25,
      lowStressPercentage: 35,
      mediumStressPercentage: 40,
      stressDistribution: {
        '1': 15,
        '2': 20,
        '3': 40,
        '4': 20,
        '5': 5
      },
      academicLoad: {
        average: 3.4,
        high: 30
      },
      socialRelations: {
        average: 2.8,
        poor: 25
      },
      mentalHealth: {
        average: 3.1,
        concerning: 28
      },
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/compare/likert-ge4', (req, res) => {
  res.json({
    success: true,
    data: {
      series: [
        {
          name: 'UCaldas',
          data: [65, 72, 68, 75, 70, 62, 58, 67, 71, 69]
        },
        {
          name: 'Otras Universidades',
          data: [58, 65, 62, 68, 64, 55, 52, 60, 66, 63]
        }
      ]
    },
    series: [
      {
        name: 'UCaldas',
        data: [65, 72, 68, 75, 70, 62, 58, 67, 71, 69]
      },
      {
        name: 'Otras Universidades',
        data: [58, 65, 62, 68, 64, 55, 52, 60, 66, 63]
      }
    ],
    categories: [
      'Estrés Académico', 
      'Carga de Trabajo', 
      'Relaciones Sociales', 
      'Salud Mental', 
      'Bienestar General',
      'Presión Familiar',
      'Problemas Económicos',
      'Expectativas Laborales',
      'Competencia Académica',
      'Satisfacción Personal'
    ],
    summary: {
      ucaldas: {
        average: 67.7,
        highest: 'Salud Mental (75%)',
        lowest: 'Problemas Económicos (58%)'
      },
      otras: {
        average: 61.3,
        highest: 'Salud Mental (68%)',
        lowest: 'Problemas Económicos (52%)'
      }
    }
  });
});

app.get('/api/factores', (req, res) => {
  res.json({
    success: true,
    data: [
      { 
        factor: 'Estrés Académico', 
        impacto: 0.8, 
        frecuencia: 0.7,
        descripcion: 'Presión por exámenes, tareas y rendimiento académico',
        estudiantes_afectados: 105,
        severidad: 'Alta'
      },
      { 
        factor: 'Carga de Trabajo', 
        impacto: 0.6, 
        frecuencia: 0.8,
        descripcion: 'Demandas excesivas de trabajo y responsabilidades',
        estudiantes_afectados: 120,
        severidad: 'Media'
      },
      { 
        factor: 'Relaciones Sociales', 
        impacto: 0.5, 
        frecuencia: 0.6,
        descripcion: 'Dificultades en relaciones interpersonales y aislamiento',
        estudiantes_afectados: 90,
        severidad: 'Media'
      },
      { 
        factor: 'Salud Mental', 
        impacto: 0.9, 
        frecuencia: 0.4,
        descripcion: 'Problemas de ansiedad, depresión y bienestar emocional',
        estudiantes_afectados: 60,
        severidad: 'Crítica'
      },
      { 
        factor: 'Presión Familiar', 
        impacto: 0.7, 
        frecuencia: 0.5,
        descripcion: 'Expectativas y presión de la familia',
        estudiantes_afectados: 75,
        severidad: 'Alta'
      },
      { 
        factor: 'Problemas Económicos', 
        impacto: 0.6, 
        frecuencia: 0.3,
        descripcion: 'Dificultades financieras y preocupaciones económicas',
        estudiantes_afectados: 45,
        severidad: 'Media'
      }
    ],
    total_factores: 6,
    factor_critico: 'Salud Mental',
    factor_mas_frecuente: 'Carga de Trabajo'
  });
});

app.get('/api/factores-clave', (req, res) => {
  res.json({
    success: true,
    data: {
      resultados: [
        {
          universidad: 'UCaldas',
          factores: [
            { factor: 'Estrés Académico', promedio: 3.2, porcentaje_ge4: 65 },
            { factor: 'Carga de Trabajo', promedio: 3.6, porcentaje_ge4: 72 },
            { factor: 'Relaciones Sociales', promedio: 2.8, porcentaje_ge4: 68 },
            { factor: 'Salud Mental', promedio: 3.8, porcentaje_ge4: 75 },
            { factor: 'Bienestar General', promedio: 3.4, porcentaje_ge4: 70 },
            { factor: 'Presión Familiar', promedio: 2.9, porcentaje_ge4: 62 },
            { factor: 'Problemas Económicos', promedio: 2.6, porcentaje_ge4: 58 },
            { factor: 'Expectativas Laborales', promedio: 3.3, porcentaje_ge4: 67 },
            { factor: 'Competencia Académica', promedio: 3.5, porcentaje_ge4: 71 },
            { factor: 'Satisfacción Personal', promedio: 3.1, porcentaje_ge4: 69 }
          ]
        },
        {
          universidad: 'Otras Universidades',
          factores: [
            { factor: 'Estrés Académico', promedio: 2.9, porcentaje_ge4: 58 },
            { factor: 'Carga de Trabajo', promedio: 3.2, porcentaje_ge4: 65 },
            { factor: 'Relaciones Sociales', promedio: 2.5, porcentaje_ge4: 62 },
            { factor: 'Salud Mental', promedio: 3.4, porcentaje_ge4: 68 },
            { factor: 'Bienestar General', promedio: 3.0, porcentaje_ge4: 64 },
            { factor: 'Presión Familiar', promedio: 2.7, porcentaje_ge4: 55 },
            { factor: 'Problemas Económicos', promedio: 2.4, porcentaje_ge4: 52 },
            { factor: 'Expectativas Laborales', promedio: 3.0, porcentaje_ge4: 60 },
            { factor: 'Competencia Académica', promedio: 3.3, porcentaje_ge4: 66 },
            { factor: 'Satisfacción Personal', promedio: 2.8, porcentaje_ge4: 63 }
          ]
        }
      ]
    }
  });
});

app.get('/api/simulaciones', (req, res) => {
  res.json({
    success: true,
    data: {
      escenarios: [
        { nombre: 'Reducción de carga académica', impacto: 0.7, costo: 'Bajo' },
        { nombre: 'Programas de bienestar', impacto: 0.6, costo: 'Medio' },
        { nombre: 'Apoyo psicológico', impacto: 0.8, costo: 'Alto' }
      ]
    }
  });
});

app.get('/api/bayesian-stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalWeight: 2.5,
      interventions: [
        { name: 'Reducción de carga académica', value: 0.8, impact: 0.7 },
        { name: 'Programas de bienestar', value: 0.6, impact: 0.6 },
        { name: 'Apoyo psicológico', value: 0.9, impact: 0.8 }
      ],
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/what-if', (req, res) => {
  res.json({
    success: true,
    data: {
      scenarios: [
        { name: 'Escenario 1', probability: 0.75, impact: 0.8 },
        { name: 'Escenario 2', probability: 0.65, impact: 0.7 },
        { name: 'Escenario 3', probability: 0.85, impact: 0.9 }
      ],
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/table-structure', (req, res) => {
  res.json({
    success: true,
    data: {
      survey_responses: [
        { column_name: 'id', data_type: 'INTEGER', is_nullable: 'NO' },
        { column_name: 'student_id', data_type: 'VARCHAR', is_nullable: 'NO' },
        { column_name: 'stress_level', data_type: 'INTEGER', is_nullable: 'NO' },
        { column_name: 'academic_load', data_type: 'INTEGER', is_nullable: 'NO' },
        { column_name: 'social_relations', data_type: 'INTEGER', is_nullable: 'NO' },
        { column_name: 'mental_health', data_type: 'INTEGER', is_nullable: 'NO' },
        { column_name: 'created_at', data_type: 'TIMESTAMP', is_nullable: 'NO' }
      ],
      timestamp: new Date().toISOString()
    }
  });
});

app.post('/api/upload-dataset', (req, res) => {
  res.json({
    success: true,
    message: 'Dataset uploaded successfully (demo mode)',
    data: {
      recordsProcessed: 150,
      fileName: 'demo_dataset.csv',
      timestamp: new Date().toISOString()
    }
  });
});

app.post('/api/clear-database', (req, res) => {
  res.json({
    success: true,
    message: 'Database cleared successfully (demo mode)',
    data: {
      recordsDeleted: 150,
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/resumen', (req, res) => {
  res.json({
    success: true,
    data: {
      promedio: 3.2,
      top: [
        { factor: 'Salud Mental', valor: 3.8, porcentaje: 75 },
        { factor: 'Carga de Trabajo', valor: 3.6, porcentaje: 72 },
        { factor: 'Competencia Académica', valor: 3.5, porcentaje: 71 },
        { factor: 'Bienestar General', valor: 3.4, porcentaje: 70 },
        { factor: 'Satisfacción Personal', valor: 3.1, porcentaje: 69 }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server listening on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
  console.log(`🔄 Server version: 2.0 - All endpoints ready`);
});
