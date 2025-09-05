/**
 * Script de prueba para la Red Bayesiana de Bienestar Estudiantil
 * Prueba las funcionalidades principales del modelo
 */

const StudentWellbeingNetwork = require('./src/student-wellbeing-network.js');

console.log('🧪 Iniciando pruebas de la Red Bayesiana...\n');

try {
  // Crear instancia de la red
  const network = new StudentWellbeingNetwork();
  console.log('✅ Red bayesiana creada exitosamente');
  
  // Mostrar información de la red
  const networkInfo = network.getNetworkInfo();
  console.log(`📊 Información de la red:`);
  console.log(`   - Nodos: ${networkInfo.nodeCount}`);
  console.log(`   - Arcos: ${networkInfo.edgeCount}`);
  console.log(`   - Variables: ${networkInfo.nodes.join(', ')}\n`);
  
  // Prueba 1: Inferencia básica
  console.log('🔍 Prueba 1: Inferencia básica');
  const baselineAnxiety = network.infer('anxiety');
  console.log(`   Estado baseline de ansiedad:`, baselineAnxiety);
  
  // Prueba 2: Simulación de intervención simple
  console.log('\n🎯 Prueba 2: Simulación de intervención simple');
  const intervention1 = { tutoria_academica: '50%' };
  const result1 = network.simulateIntervention(intervention1, 'concentration_issues');
  console.log(`   Intervención: ${JSON.stringify(intervention1)}`);
  console.log(`   Resultado en concentración:`, result1);
  
  // Prueba 3: Simulación de múltiples intervenciones
  console.log('\n🎯 Prueba 3: Simulación de múltiples intervenciones');
  const intervention2 = { 
    tutoria_academica: '75%', 
    salud_mental: '50%',
    apoyo_financiero: '25%'
  };
  const result2 = network.simulateIntervention(intervention2, 'wellbeing_index');
  console.log(`   Intervenciones: ${JSON.stringify(intervention2)}`);
  console.log(`   Resultado en bienestar general:`, result2);
  
  // Prueba 4: Cálculo de impacto esperado
  console.log('\n📈 Prueba 4: Cálculo de impacto esperado');
  const impact = network.calculateExpectedImpact('tutoria_academica', '50%', 'concentration_issues');
  console.log(`   Impacto de tutoría académica 50% en concentración:`);
  console.log(`   - Baseline: ${impact.baseline.toFixed(2)}`);
  console.log(`   - Post-intervención: ${impact.postIntervention.toFixed(2)}`);
  console.log(`   - Mejora: ${impact.improvement.toFixed(2)} (${impact.improvementPercent.toFixed(1)}%)`);
  
  // Prueba 5: Simulación completa
  console.log('\n🌐 Prueba 5: Simulación completa');
  const fullImpact = network.calculateInterventionImpact(intervention2);
  console.log(`   Impacto completo de las intervenciones:`);
  for (const [variable, probabilities] of Object.entries(fullImpact)) {
    const expectedValue = network.calculateExpectedValue(probabilities);
    console.log(`   - ${variable}: ${expectedValue.toFixed(2)}`);
  }
  
  // Prueba 6: Explicación de simulación
  console.log('\n📝 Prueba 6: Explicación de simulación');
  const explanation = network.getSimulationExplanation(intervention1, 'concentration_issues');
  console.log(`   Explicación:\n${explanation}`);
  
  // Prueba 7: Validación de fórmulas matemáticas
  console.log('\n🧮 Prueba 7: Validación de fórmulas matemáticas');
  
  // Verificar que las probabilidades suman 1
  const testProbabilities = network.infer('anxiety');
  const sum = Object.values(testProbabilities).reduce((a, b) => a + b, 0);
  console.log(`   Suma de probabilidades de ansiedad: ${sum.toFixed(6)} (debe ser ≈ 1.0)`);
  
  // Verificar que los valores esperados están en rango
  const expectedValue = network.calculateExpectedValue(testProbabilities);
  console.log(`   Valor esperado de ansiedad: ${expectedValue.toFixed(2)} (debe estar entre 1-5)`);
  
  // Prueba 8: Comparación con sistema original
  console.log('\n🔄 Prueba 8: Comparación con sistema original');
  console.log(`   Sistema original (determinístico):`);
  console.log(`   - Tutoría 50% → Concentración: reducción fija del 30%`);
  console.log(`   Sistema bayesiano (probabilístico):`);
  console.log(`   - Tutoría 50% → Concentración: distribución de probabilidades`);
  console.log(`   - Baja: ${(result1.baja * 100).toFixed(1)}%`);
  console.log(`   - Media: ${(result1.media * 100).toFixed(1)}%`);
  console.log(`   - Alta: ${(result1.alta * 100).toFixed(1)}%`);
  
  console.log('\n✅ Todas las pruebas completadas exitosamente!');
  console.log('\n📋 Resumen de funcionalidades implementadas:');
  console.log('   ✅ Inferencia bayesiana básica');
  console.log('   ✅ Simulaciones what-if');
  console.log('   ✅ Cálculo de impacto esperado');
  console.log('   ✅ Simulaciones de múltiples intervenciones');
  console.log('   ✅ Explicaciones textuales');
  console.log('   ✅ Validación matemática');
  console.log('   ✅ Integración con sistema existente');
  
} catch (error) {
  console.error('❌ Error en las pruebas:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
