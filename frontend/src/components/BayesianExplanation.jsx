/**
 * Componente para mostrar explicaciones de simulaciones bayesianas
 * Muestra el análisis causal y las fórmulas matemáticas aplicadas
 */

import React from 'react';

export default function BayesianExplanation({ 
  explanation, 
  baseline, 
  postIntervention, 
  impact, 
  target,
  interventions 
}) {
  if (!explanation) return null;

  // Mapeo de variables a etiquetas en español
  const variableLabels = {
    'wellbeing_index': 'Índice de Bienestar General',
    'anxiety': 'Ansiedad',
    'sleep_problems': 'Problemas de Sueño',
    'concentration_issues': 'Problemas de Concentración',
    'academic_overload': 'Sobrecarga Académica',
    'sadness': 'Tristeza',
    'headaches': 'Dolores de Cabeza',
    'palpitations': 'Palpitaciones',
    'irritability': 'Irritabilidad'
  };

  const interventionLabels = {
    'tutoria_academica': 'Tutoría Académica',
    'salud_mental': 'Salud Mental',
    'apoyo_financiero': 'Apoyo Financiero'
  };

  const targetLabel = variableLabels[target] || target;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 text-lg">🧠</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Análisis Bayesiano - {targetLabel}
        </h3>
      </div>

      {/* Intervenciones Aplicadas */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">🎯 Intervenciones Simuladas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interventions && Object.entries(interventions).map(([intervention, value]) => (
            <div key={intervention} className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-800">
                {interventionLabels[intervention] || intervention}
              </div>
              <div className="text-lg font-bold text-blue-600">{value}</div>
            </div>
          )) || (
            <div className="text-sm text-gray-500 italic">
              No hay intervenciones aplicadas
            </div>
          )}
        </div>
      </div>

      {/* Resultados Comparativos */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">📊 Resultados Comparativos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado Actual */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-600 mb-2">Estado Actual (Baseline)</h5>
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {baseline?.expectedValue?.toFixed(2) || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              Valor esperado en escala 1-5
            </div>
            {baseline?.probabilities && (
              <div className="mt-3 space-y-1">
                {baseline.probabilities && Object.entries(baseline.probabilities).map(([state, prob]) => (
                  <div key={state} className="flex justify-between text-xs">
                    <span className="capitalize">{state}:</span>
                    <span className="font-medium">{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estado Post-Intervención */}
          <div className="bg-green-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-green-600 mb-2">Después de la Intervención</h5>
            <div className="text-2xl font-bold text-green-800 mb-2">
              {postIntervention?.expectedValue?.toFixed(2) || 'N/A'}
            </div>
            <div className="text-sm text-green-600">
              Valor esperado proyectado
            </div>
            {postIntervention?.probabilities && (
              <div className="mt-3 space-y-1">
                {postIntervention.probabilities && Object.entries(postIntervention.probabilities).map(([state, prob]) => (
                  <div key={state} className="flex justify-between text-xs">
                    <span className="capitalize">{state}:</span>
                    <span className="font-medium">{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Impacto Calculado */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">📈 Impacto Esperado</h4>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Cambio en valor esperado</div>
              <div className={`text-2xl font-bold ${
                impact?.improvement > 0 ? 'text-green-600' : 
                impact?.improvement < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {impact?.improvement > 0 ? '+' : ''}{impact?.improvement?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Porcentaje de cambio</div>
              <div className={`text-xl font-bold ${
                impact?.improvementPercent > 0 ? 'text-green-600' : 
                impact?.improvementPercent < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {impact?.improvementPercent > 0 ? '+' : ''}{impact?.improvementPercent?.toFixed(1) || '0.0'}%
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Dirección: <span className="font-medium capitalize">
              {impact?.direction === 'positive' ? 'Mejora' : 
               impact?.direction === 'negative' ? 'Empeoramiento' : 'Sin cambio'}
            </span>
          </div>
        </div>
      </div>

      {/* Explicación Textual */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">🔍 Explicación Causal</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {explanation}
          </pre>
        </div>
      </div>

      {/* Fórmulas Matemáticas */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">🧮 Fórmulas Aplicadas</h4>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-medium text-blue-800">Teorema de Bayes:</div>
              <code className="text-blue-700">P(A|B) = P(B|A) × P(A) / P(B)</code>
            </div>
            <div>
              <div className="font-medium text-blue-800">Inferencia de Intervención:</div>
              <code className="text-blue-700">P(Y | do(X = x)) = ∑ P(Y | X = x, Pa(X)) × P(Pa(X))</code>
            </div>
            <div>
              <div className="font-medium text-blue-800">Valor Esperado:</div>
              <code className="text-blue-700">E[Y] = ∑ y × P(Y = y)</code>
            </div>
          </div>
        </div>
      </div>

      {/* Interpretación */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400 text-lg">💡</span>
          </div>
          <div className="ml-3">
            <h5 className="text-sm font-medium text-yellow-800">Interpretación</h5>
            <div className="mt-1 text-sm text-yellow-700">
              {impact?.improvement > 0 ? (
                <p>La intervención propuesta mejorará el {targetLabel.toLowerCase()} en promedio. 
                Esta es una predicción causal basada en inferencia bayesiana, no solo correlación.</p>
              ) : impact?.improvement < 0 ? (
                <p>La intervención propuesta podría empeorar el {targetLabel.toLowerCase()}. 
                Considera ajustar los niveles de inversión o explorar otras estrategias.</p>
              ) : (
                <p>La intervención propuesta no tendrá un impacto significativo en el {targetLabel.toLowerCase()}. 
                Podrías necesitar niveles más altos de inversión para ver resultados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
