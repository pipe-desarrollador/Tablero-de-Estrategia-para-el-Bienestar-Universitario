import React from 'react';

const RealTimeBayesianAnalysis = ({ 
  tutoria, 
  sueno, 
  finanzas, 
  eff, 
  scenarioValue, 
  baselineValue, 
  delta 
}) => {
  // Usar los datos reales del backend si están disponibles
  const getScenarioIndex = () => {
    // Si tenemos datos del backend, usar el valor real del escenario
    if (scenarioValue !== null) {
      return scenarioValue;
    }
    
    // Si no hay datos del backend, calcular un índice aproximado
    const totalIntervention = (tutoria + sueno + finanzas) / 3;
    const effectivenessFactor = eff;
    const baseIndex = baselineValue || 0; // Sin datos, empezar en 0
    
    // Fórmula simplificada: índice base + (intervenciones * efectividad)
    const scenarioIndex = baseIndex + (totalIntervention * effectivenessFactor * 0.1);
    return Math.min(Math.max(scenarioIndex, 0), 100);
  };

  const scenarioIndex = getScenarioIndex();

  // Análisis bayesiano de las intervenciones
  const getBayesianAnalysis = () => {
    // Definir intervenciones base
    const interventions = [
      { name: 'Tutoría Académica', value: tutoria, impact: 0.3 },
      { name: 'Salud Mental', value: sueno, impact: 0.4 },
      { name: 'Apoyo Financiero', value: finanzas, impact: 0.3 }
    ];

    // Calcular totalWeight para ambos casos
    const totalWeight = interventions.reduce((sum, int) => sum + (int.value * int.impact), 0);
    const maxPossible = interventions.reduce((sum, int) => sum + (100 * int.impact), 0);

    // Si tenemos datos reales del backend, usar esos valores
    if (baselineValue !== null && scenarioValue !== null) {
      const realImprovement = baselineValue - scenarioValue; // Mejora real del backend
      const realProbability = Math.abs(realImprovement) / baselineValue; // Probabilidad basada en mejora real
      
      return {
        interventions,
        totalWeight,
        maxPossible,
        bayesianProbability: Math.min(realProbability, 1), // Limitar a 100%
        expectedImprovement: realImprovement,
        isRealData: true
      };
    }

    // Si no hay datos reales, calcular valores aproximados
    const bayesianProbability = totalWeight / maxPossible;

    return {
      interventions,
      totalWeight,
      maxPossible,
      bayesianProbability,
      expectedImprovement: bayesianProbability * 20,
      isRealData: false
    };
  };

  const analysis = getBayesianAnalysis();

  // Interpretación del resultado
  const getInterpretation = () => {
    // Si tenemos datos reales, usar la mejora real para la interpretación
    if (analysis.isRealData) {
      const improvement = analysis.expectedImprovement;
      if (improvement > 2) {
        return {
          level: 'Excelente',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          explanation: `Las intervenciones muestran una mejora significativa de ${improvement.toFixed(1)} puntos porcentuales. Excelente impacto en el bienestar estudiantil.`
        };
      } else if (improvement > 0.5) {
        return {
          level: 'Bueno',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          explanation: `Las intervenciones muestran una mejora moderada de ${improvement.toFixed(1)} puntos porcentuales. Impacto positivo en el bienestar estudiantil.`
        };
      } else if (improvement > 0) {
        return {
          level: 'Leve',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          explanation: `Las intervenciones muestran una mejora leve de ${improvement.toFixed(1)} puntos porcentuales. Considera aumentar las inversiones para mayor impacto.`
        };
      } else {
        return {
          level: 'Sin Mejora',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          explanation: 'Las intervenciones actuales no muestran mejora significativa. Se recomienda revisar la estrategia o aumentar las inversiones.'
        };
      }
    }

    // Interpretación basada en el índice calculado (cuando no hay datos reales)
    if (scenarioIndex < 30) {
      return {
        level: 'Bajo',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        explanation: 'Las intervenciones actuales tienen un impacto limitado. Se recomienda aumentar la inversión en programas de bienestar.'
      };
    } else if (scenarioIndex < 60) {
      return {
        level: 'Moderado',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        explanation: 'Las intervenciones muestran un impacto moderado. Considera optimizar la efectividad del modelo o aumentar las inversiones.'
      };
    } else {
      return {
        level: 'Alto',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        explanation: 'Excelente configuración de intervenciones. El modelo predice un impacto significativo en el bienestar estudiantil.'
      };
    }
  };

  const interpretation = getInterpretation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🧠 Análisis Bayesiano en Tiempo Real
      </h3>

      {/* Índice de Escenario */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Índice de Escenario</span>
          <span className={`text-2xl font-bold ${interpretation.color}`}>
            {scenarioIndex.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              interpretation.level === 'Bajo' ? 'bg-red-500' :
              interpretation.level === 'Moderado' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${scenarioIndex}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {scenarioValue !== null ? (
            `Datos reales del backend (Baseline: ${baselineValue?.toFixed(1) || 'N/A'}%)`
          ) : (
            `Calculado: Tutoría {tutoria}% + Salud Mental {sueno}% + Apoyo Financiero {finanzas}% (Efectividad: {(eff * 100).toFixed(0)}%)`
          )}
        </p>
      </div>

      {/* Análisis Bayesiano */}
      <div className={`${interpretation.bgColor} ${interpretation.borderColor} border rounded-lg p-4 mb-4`}>
        <h4 className={`font-semibold ${interpretation.color} mb-2`}>
          📊 Interpretación Bayesiana
        </h4>
        <p className="text-sm text-gray-700 mb-3">{interpretation.explanation}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="font-medium text-gray-700">Probabilidad Bayesiana:</span>
            <span className="ml-2 font-semibold text-blue-600">
              {(analysis.bayesianProbability * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Mejora Esperada:</span>
            <span className="ml-2 font-semibold text-green-600">
              +{analysis.expectedImprovement.toFixed(1)} pp
            </span>
          </div>
        </div>

        {/* Explicación detallada de la interpretación */}
        <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-3">
          <h5 className="font-semibold text-gray-800 mb-2">🔍 ¿Qué significa este resultado?</h5>
          <div className="text-sm text-gray-700 space-y-2">
            {analysis.isRealData ? (
              <>
                <p>• <strong>Datos Reales del Backend:</strong> Estos valores están calculados usando los datos reales de {baselineValue?.toFixed(1)}% de estudiantes con bienestar alto.</p>
                <p>• <strong>Mejora Real: {analysis.expectedImprovement.toFixed(1)} pp:</strong> Esta es la mejora real calculada por el modelo bayesiano del backend.</p>
                <p>• <strong>Probabilidad Bayesiana: {(analysis.bayesianProbability * 100).toFixed(1)}%:</strong> Probabilidad de éxito basada en la mejora real observada.</p>
                <p>• <strong>Recomendación:</strong> {interpretation.explanation}</p>
              </>
            ) : (
              <>
                {interpretation.level === 'Bajo' && (
                  <>
                    <p>• <strong>Probabilidad Bayesiana {analysis.bayesianProbability.toFixed(1)}:</strong> Las intervenciones actuales tienen un impacto limitado en el bienestar estudiantil.</p>
                    <p>• <strong>Mejora Esperada +{analysis.expectedImprovement.toFixed(1)} pp:</strong> Se espera una mejora mínima en el porcentaje de estudiantes con bienestar alto.</p>
                    <p>• <strong>Recomendación:</strong> Considera aumentar significativamente las inversiones o mejorar la efectividad del modelo.</p>
                  </>
                )}
                {interpretation.level === 'Moderado' && (
                  <>
                    <p>• <strong>Probabilidad Bayesiana {analysis.bayesianProbability.toFixed(1)}:</strong> Las intervenciones muestran un impacto moderado y prometedor.</p>
                    <p>• <strong>Mejora Esperada +{analysis.expectedImprovement.toFixed(1)} pp:</strong> Se espera una mejora notable en el bienestar estudiantil.</p>
                    <p>• <strong>Recomendación:</strong> Optimiza la efectividad del modelo o aumenta las inversiones para maximizar el impacto.</p>
                  </>
                )}
                {interpretation.level === 'Alto' && (
                  <>
                    <p>• <strong>Probabilidad Bayesiana {analysis.bayesianProbability.toFixed(1)}:</strong> Las intervenciones tienen un impacto significativo y bien balanceado.</p>
                    <p>• <strong>Mejora Esperada +{analysis.expectedImprovement.toFixed(1)} pp:</strong> Se espera una mejora sustancial en el bienestar estudiantil.</p>
                    <p>• <strong>Recomendación:</strong> Mantén esta configuración y considera monitorear los resultados para optimizar aún más.</p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Explicación de la fórmula */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="font-semibold text-blue-900 mb-2">🧮 ¿Cómo se calcula?</h5>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Paso 1:</strong> Cada intervención se multiplica por su peso e efectividad</p>
            <p><strong>Paso 2:</strong> Se suman todos los resultados</p>
            <p><strong>Paso 3:</strong> Se divide entre el máximo posible</p>
            <p><strong>Resultado:</strong> Probabilidad de éxito del 0% al 100%</p>
          </div>
        </div>
      </div>

      {/* Desglose de Intervenciones */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">🔍 Desglose de Intervenciones</h4>
        <p className="text-sm text-gray-600 mb-3">
          Cada intervención tiene un <strong>peso</strong> (impacto relativo) y una <strong>contribución</strong> (cuánto aporta al resultado final):
        </p>
        {analysis.interventions.map((intervention, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{intervention.name}</span>
              <span className="text-sm font-semibold text-blue-600">{intervention.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${intervention.value}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Peso:</span>
                <span className="ml-1">{(intervention.impact * 100).toFixed(0)}%</span>
                <p className="text-xs text-gray-500 mt-1">
                  {intervention.impact === 0.4 ? 'Mayor impacto' : 
                   intervention.impact === 0.3 ? 'Impacto medio' : 'Menor impacto'}
                </p>
              </div>
              <div>
                <span className="font-medium">Contribución:</span>
                <span className="ml-1">
                  {analysis.totalWeight > 0 
                    ? ((intervention.value * intervention.impact) / analysis.totalWeight * 100).toFixed(1) + '%'
                    : '0.0%'
                  }
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {analysis.totalWeight > 0 
                    ? (() => {
                        const contribution = (intervention.value * intervention.impact) / analysis.totalWeight * 100;
                        return contribution > 40 ? 'Alta contribución' :
                               contribution > 25 ? 'Contribución media' : 'Baja contribución';
                      })()
                    : 'Sin contribución'
                  }
                </p>
              </div>
            </div>
            <div className="mt-2 p-2 bg-white rounded border-l-4 border-blue-400">
              <p className="text-xs text-gray-700">
                <strong>Explicación:</strong> {intervention.name} al {intervention.value}% con peso {(intervention.impact * 100).toFixed(0)}% 
                contribuye {analysis.totalWeight > 0 
                  ? ((intervention.value * intervention.impact) / analysis.totalWeight * 100).toFixed(1) + '%'
                  : '0.0%'
                } al resultado final.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fórmula Bayesiana */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-3">🧮 Fórmula Aplicada</h5>
        <div className="text-sm text-blue-800 space-y-3">
          <div className="bg-white p-3 rounded border-l-4 border-blue-400">
            <p className="mb-2">
              <strong>P(Éxito | Intervenciones) =</strong>
            </p>
            <p className="mb-2">
              <strong>Σ(Intervención × Peso × Efectividad) / Máximo Posible</strong>
            </p>
            <p className="text-xs text-blue-600">
              Donde: Peso = Impacto relativo, Efectividad = {eff.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border-l-4 border-green-400">
            <h6 className="font-semibold text-green-800 mb-2">📊 Cálculo Paso a Paso:</h6>
            <div className="space-y-1 text-xs">
              <p><strong>1. Tutoría:</strong> {tutoria}% × 30% × {eff.toFixed(2)} = {((tutoria * 0.3 * eff) / 100).toFixed(3)}</p>
              <p><strong>2. Salud Mental:</strong> {sueno}% × 40% × {eff.toFixed(2)} = {((sueno * 0.4 * eff) / 100).toFixed(3)}</p>
              <p><strong>3. Apoyo Financiero:</strong> {finanzas}% × 30% × {eff.toFixed(2)} = {((finanzas * 0.3 * eff) / 100).toFixed(3)}</p>
              <p><strong>4. Total:</strong> {((tutoria * 0.3 * eff) / 100).toFixed(3)} + {((sueno * 0.4 * eff) / 100).toFixed(3)} + {((finanzas * 0.3 * eff) / 100).toFixed(3)} = {((tutoria * 0.3 * eff + sueno * 0.4 * eff + finanzas * 0.3 * eff) / 100).toFixed(3)}</p>
              <p><strong>5. Máximo Posible:</strong> 100% × 40% × {eff.toFixed(2)} = {(0.4 * eff).toFixed(3)}</p>
              <p><strong>6. Resultado:</strong> {((tutoria * 0.3 * eff + sueno * 0.4 * eff + finanzas * 0.3 * eff) / 100).toFixed(3)} / {(0.4 * eff).toFixed(3)} = {(((tutoria * 0.3 * eff + sueno * 0.4 * eff + finanzas * 0.3 * eff) / 100) / (0.4 * eff)).toFixed(3)} = {(((tutoria * 0.3 * eff + sueno * 0.4 * eff + finanzas * 0.3 * eff) / 100) / (0.4 * eff) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border-l-4 border-purple-400">
            <h6 className="font-semibold text-purple-800 mb-2">💡 ¿Qué significa cada parte?</h6>
            <div className="space-y-1 text-xs">
              <p><strong>• Intervención:</strong> El porcentaje que configuraste para cada programa</p>
              <p><strong>• Peso:</strong> Qué tan importante es cada intervención (30%, 40%, 30%)</p>
              <p><strong>• Efectividad:</strong> Qué tan bien funcionan las intervenciones en la práctica</p>
              <p><strong>• Máximo Posible:</strong> El mejor resultado teórico si todo estuviera al 100%</p>
              <p><strong>• Resultado:</strong> La probabilidad de éxito de tu configuración actual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones Específicas */}
      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <h5 className="font-semibold text-green-900 mb-3">🎯 Recomendaciones Específicas</h5>
        <div className="space-y-3">
          {analysis.interventions.map((intervention, index) => {
            const contribution = (intervention.value * intervention.impact) / analysis.totalWeight * 100;
            const isLowContribution = contribution < 25;
            const isHighWeight = intervention.impact === 0.4;
            
            return (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                isLowContribution && isHighWeight ? 'bg-yellow-50 border-yellow-400' :
                isLowContribution ? 'bg-orange-50 border-orange-400' :
                'bg-green-50 border-green-400'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{intervention.name}</span>
                  <span className={`text-sm font-semibold ${
                    isLowContribution && isHighWeight ? 'text-yellow-700' :
                    isLowContribution ? 'text-orange-700' : 'text-green-700'
                  }`}>
                    {intervention.value}%
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {isLowContribution && isHighWeight ? (
                    `⚠️ Esta intervención tiene alto impacto (${(intervention.impact * 100).toFixed(0)}%) pero baja contribución (${contribution.toFixed(1)}%). Considera aumentar la inversión para maximizar el impacto.`
                  ) : isLowContribution ? (
                    `📈 Contribución actual: ${contribution.toFixed(1)}%. Podrías aumentar la inversión para mejorar el resultado general.`
                  ) : (
                    `✅ Buena configuración. Contribución: ${contribution.toFixed(1)}%. Mantén o considera aumentar ligeramente.`
                  )}
                </p>
              </div>
            );
          })}
          
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <h6 className="font-semibold text-blue-900 mb-2">💡 Estrategia General</h6>
            <p className="text-sm text-blue-800">
              {eff < 0.5 ? (
                "La efectividad del modelo está baja. Considera mejorar la implementación de los programas o aumentar los recursos para maximizar el impacto de las intervenciones."
              ) : eff < 0.7 ? (
                "La efectividad es moderada. Hay espacio para optimizar la implementación y mejorar los resultados."
              ) : (
                "Excelente efectividad del modelo. Las intervenciones están bien implementadas y funcionando eficientemente."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeBayesianAnalysis;
