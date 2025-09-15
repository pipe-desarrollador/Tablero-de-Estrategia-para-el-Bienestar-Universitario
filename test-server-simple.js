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
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/compare/likert-ge4', (req, res) => {
  res.json({
    success: true,
    series: [
      {
        name: 'UCaldas',
        data: [65, 72, 68, 75, 70]
      },
      {
        name: 'Otras Universidades',
        data: [58, 65, 62, 68, 64]
      }
    ],
    categories: ['Estrés Académico', 'Carga de Trabajo', 'Relaciones Sociales', 'Salud Mental', 'Bienestar General']
  });
});

app.get('/api/factores', (req, res) => {
  res.json({
    success: true,
    data: [
      { factor: 'Estrés Académico', impacto: 0.8, frecuencia: 0.7 },
      { factor: 'Carga de Trabajo', impacto: 0.6, frecuencia: 0.8 },
      { factor: 'Relaciones Sociales', impacto: 0.5, frecuencia: 0.6 },
      { factor: 'Salud Mental', impacto: 0.9, frecuencia: 0.4 }
    ]
  });
});

app.get('/api/factores-clave', (req, res) => {
  res.json({
    success: true,
    data: [
      { factor: 'Estrés Académico', impacto: 0.8, frecuencia: 0.7 },
      { factor: 'Carga de Trabajo', impacto: 0.6, frecuencia: 0.8 },
      { factor: 'Relaciones Sociales', impacto: 0.5, frecuencia: 0.6 },
      { factor: 'Salud Mental', impacto: 0.9, frecuencia: 0.4 }
    ]
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
      tables: [
        { name: 'survey_responses', columns: ['id', 'student_id', 'stress_level', 'academic_load', 'social_relations', 'mental_health', 'created_at'] },
        { name: 'students', columns: ['id', 'name', 'university', 'program', 'year', 'created_at'] }
      ],
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server listening on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
});
