// Script para cargar datos de demostración
const { Pool } = require('pg');
const path = require('path');

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:His-Password@localhost:5432/stress_db'
});

// Datos de demostración realistas
const demoData = [
  // Estudiantes con estrés académico alto
  { gender: 'F', age: 20, sleep_problems: '4', headaches: '3', concentration_issues: '4', irritability: '3', palpitations: '2', sadness: '3', anxiety: '4', stress_type: 'Académico', source: 'Demo_Data' },
  { gender: 'M', age: 22, sleep_problems: '3', headaches: '4', concentration_issues: '5', irritability: '4', palpitations: '3', sadness: '2', anxiety: '3', stress_type: 'Académico', source: 'Demo_Data' },
  { gender: 'F', age: 19, sleep_problems: '5', headaches: '2', concentration_issues: '4', irritability: '3', palpitations: '4', sadness: '4', anxiety: '5', stress_type: 'Académico', source: 'Demo_Data' },
  
  // Estudiantes con estrés social
  { gender: 'M', age: 21, sleep_problems: '3', headaches: '3', concentration_issues: '2', irritability: '4', palpitations: '3', sadness: '4', anxiety: '3', stress_type: 'Social', source: 'Demo_Data' },
  { gender: 'F', age: 23, sleep_problems: '4', headaches: '3', concentration_issues: '3', irritability: '3', palpitations: '2', sadness: '5', anxiety: '4', stress_type: 'Social', source: 'Demo_Data' },
  
  // Estudiantes con estrés financiero
  { gender: 'M', age: 24, sleep_problems: '4', headaches: '4', concentration_issues: '3', irritability: '4', palpitations: '4', sadness: '3', anxiety: '4', stress_type: 'Financiero', source: 'Demo_Data' },
  { gender: 'F', age: 20, sleep_problems: '3', headaches: '5', concentration_issues: '4', irritability: '3', palpitations: '3', sadness: '4', anxiety: '3', stress_type: 'Financiero', source: 'Demo_Data' },
  
  // Estudiantes con estrés de salud
  { gender: 'F', age: 21, sleep_problems: '5', headaches: '4', concentration_issues: '3', irritability: '2', palpitations: '5', sadness: '3', anxiety: '4', stress_type: 'Salud', source: 'Demo_Data' },
  { gender: 'M', age: 22, sleep_problems: '4', headaches: '3', concentration_issues: '2', irritability: '3', palpitations: '4', sadness: '2', anxiety: '3', stress_type: 'Salud', source: 'Demo_Data' },
  
  // Estudiantes con bajo estrés (casos de control)
  { gender: 'F', age: 20, sleep_problems: '2', headaches: '1', concentration_issues: '2', irritability: '1', palpitations: '1', sadness: '1', anxiety: '2', stress_type: 'Académico', source: 'Demo_Data' },
  { gender: 'M', age: 23, sleep_problems: '1', headaches: '2', concentration_issues: '1', irritability: '2', palpitations: '1', sadness: '2', anxiety: '1', stress_type: 'Social', source: 'Demo_Data' },
  
  // Más datos para tener una muestra representativa
  { gender: 'F', age: 19, sleep_problems: '3', headaches: '3', concentration_issues: '3', irritability: '3', palpitations: '2', sadness: '3', anxiety: '3', stress_type: 'Académico', source: 'Demo_Data' },
  { gender: 'M', age: 21, sleep_problems: '4', headaches: '2', concentration_issues: '4', irritability: '3', palpitations: '3', sadness: '2', anxiety: '4', stress_type: 'Académico', source: 'Demo_Data' },
  { gender: 'F', age: 22, sleep_problems: '2', headaches: '4', concentration_issues: '2', irritability: '4', palpitations: '2', sadness: '4', anxiety: '2', stress_type: 'Social', source: 'Demo_Data' },
  { gender: 'M', age: 20, sleep_problems: '3', headaches: '3', concentration_issues: '3', irritability: '2', palpitations: '4', sadness: '3', anxiety: '3', stress_type: 'Financiero', source: 'Demo_Data' },
  { gender: 'F', age: 24, sleep_problems: '4', headaches: '3', concentration_issues: '4', irritability: '3', palpitations: '3', sadness: '3', anxiety: '4', stress_type: 'Salud', source: 'Demo_Data' },
  { gender: 'M', age: 19, sleep_problems: '2', headaches: '2', concentration_issues: '2', irritability: '2', palpitations: '2', sadness: '2', anxiety: '2', stress_type: 'Académico', source: 'Demo_Data' },
  { gender: 'F', age: 23, sleep_problems: '3', headaches: '3', concentration_issues: '3', irritability: '3', palpitations: '3', sadness: '3', anxiety: '3', stress_type: 'Social', source: 'Demo_Data' },
  { gender: 'M', age: 21, sleep_problems: '4', headaches: '4', concentration_issues: '4', irritability: '4', palpitations: '4', sadness: '4', anxiety: '4', stress_type: 'Financiero', source: 'Demo_Data' },
  { gender: 'F', age: 20, sleep_problems: '5', headaches: '3', concentration_issues: '5', irritability: '3', palpitations: '5', sadness: '3', anxiety: '5', stress_type: 'Salud', source: 'Demo_Data' },
  { gender: 'M', age: 22, sleep_problems: '1', headaches: '1', concentration_issues: '1', irritability: '1', palpitations: '1', sadness: '1', anxiety: '1', stress_type: 'Académico', source: 'Demo_Data' }
];

async function seedDemoData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Iniciando carga de datos de demostración...');
    
    // Limpiar datos de demostración existentes
    await client.query('DELETE FROM survey_responses WHERE source = $1', ['Demo_Data']);
    console.log('🧹 Datos de demostración anteriores eliminados');
    
    // Insertar nuevos datos
    let inserted = 0;
    for (const record of demoData) {
      const columns = Object.keys(record);
      const values = Object.values(record);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      
      await client.query(
        `INSERT INTO survey_responses (${columns.join(', ')}) VALUES (${placeholders})`,
        values
      );
      inserted++;
    }
    
    console.log(`✅ ${inserted} registros de demostración insertados exitosamente`);
    console.log('📊 Datos de demostración listos para usar');
    
    // Mostrar estadísticas
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN stress_type = 'Académico' THEN 1 END) as academico,
        COUNT(CASE WHEN stress_type = 'Social' THEN 1 END) as social,
        COUNT(CASE WHEN stress_type = 'Financiero' THEN 1 END) as financiero,
        COUNT(CASE WHEN stress_type = 'Salud' THEN 1 END) as salud
      FROM survey_responses 
      WHERE source = 'Demo_Data'
    `);
    
    const { total, academico, social, financiero, salud } = stats.rows[0];
    console.log('\n📈 Estadísticas de datos de demostración:');
    console.log(`   Total: ${total} registros`);
    console.log(`   Académico: ${academico}`);
    console.log(`   Social: ${social}`);
    console.log(`   Financiero: ${financiero}`);
    console.log(`   Salud: ${salud}`);
    
  } catch (error) {
    console.error('❌ Error cargando datos de demostración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDemoData()
    .then(() => {
      console.log('🎉 Carga de datos de demostración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { seedDemoData };
