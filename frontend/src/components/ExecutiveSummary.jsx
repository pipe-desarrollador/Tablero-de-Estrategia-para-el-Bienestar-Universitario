// /src/components/ExecutiveSummary.jsx
// Descripción: Resumen ejecutivo para toma de decisiones del rector
import { useState } from 'react';

export default function ExecutiveSummary({ data = [] }) {
  const [selectedUniversity, setSelectedUniversity] = useState('all');

  // Calcular métricas clave
  const calculateMetrics = () => {
    if (!data || data.length === 0) return null;

    const metrics = {};
    
    data.forEach(series => {
      if (series.data) {
        const values = series.data.map(item => item.y);
        const maxValue = Math.max(...values);
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        const maxFactor = series.data.find(item => item.y === maxValue);
        
        metrics[series.name] = {
          average: avgValue,
          maxValue: maxValue,
          criticalFactor: maxFactor,
          totalFactors: values.length,
          highStressFactors: values.filter(v => v > 30).length
        };
      }
    });

    return metrics;
  };

  const metrics = calculateMetrics();

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No hay datos suficientes para generar el resumen ejecutivo</p>
        </div>
      </div>
    );
  }

  const getPriorityLevel = (value) => {
    if (value > 40) return { level: 'CRÍTICO', color: 'text-red-600 bg-red-50' };
    if (value > 30) return { level: 'ALTO', color: 'text-orange-600 bg-orange-50' };
    if (value > 20) return { level: 'MEDIO', color: 'text-yellow-600 bg-yellow-50' };
    return { level: 'BAJO', color: 'text-green-600 bg-green-50' };
  };

  const getRecommendation = (universityName, metric) => {
    const priority = getPriorityLevel(metric.average);
    
    if (priority.level === 'CRÍTICO') {
      return {
        action: 'ACCIÓN INMEDIATA REQUERIDA',
        description: `Implementar programa de emergencia para ${metric.criticalFactor?.x || 'factores críticos'}`,
        budget: 'Alto',
        timeframe: '1-3 meses'
      };
    } else if (priority.level === 'ALTO') {
      return {
        action: 'PLAN ESTRATÉGICO PRIORITARIO',
        description: `Desarrollar estrategia integral para ${metric.criticalFactor?.x || 'factores de alto impacto'}`,
        budget: 'Medio-Alto',
        timeframe: '3-6 meses'
      };
    } else {
      return {
        action: 'MEJORA CONTINUA',
        description: `Mantener y optimizar programas existentes`,
        budget: 'Bajo-Medio',
        timeframe: '6-12 meses'
      };
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-800">Resumen Ejecutivo</h3>
        </div>
        <p className="text-gray-600">
          Análisis estratégico para la toma de decisiones en bienestar estudiantil
        </p>
      </div>

      {/* Selector de universidad */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Universidad para Análisis Detallado:
        </label>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Comparación General</option>
          {Object.keys(metrics).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(metrics).map(([universityName, metric]) => {
          const priority = getPriorityLevel(metric.average);
          const isSelected = selectedUniversity === 'all' || selectedUniversity === universityName;
          
          if (!isSelected) return null;

          return (
            <div key={universityName} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{universityName}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                  {priority.level}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Promedio de Estrés:</span>
                  <span className="font-semibold">{metric.average.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Factor Crítico:</span>
                  <span className="font-semibold text-red-600">{metric.criticalFactor?.x || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Factores de Alto Estrés:</span>
                  <span className="font-semibold">{metric.highStressFactors}/{metric.totalFactors}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recomendaciones estratégicas */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Recomendaciones Estratégicas</h4>
        
        {selectedUniversity === 'all' ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2">Análisis Comparativo</h5>
              <p className="text-sm text-blue-700">
                Basado en la comparación entre universidades, se recomienda implementar un 
                <strong> programa de intercambio de mejores prácticas</strong> para optimizar 
                los recursos y maximizar el impacto en el bienestar estudiantil.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(metrics).map(([universityName, metric]) => {
              if (selectedUniversity !== universityName) return null;
              
              const recommendation = getRecommendation(universityName, metric);
              
              return (
                <div key={universityName} className="space-y-3">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h5 className="font-semibold text-orange-800 mb-2">{recommendation.action}</h5>
                    <p className="text-sm text-orange-700 mb-3">{recommendation.description}</p>
                    <div className="flex gap-4 text-xs">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Presupuesto: {recommendation.budget}
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Tiempo: {recommendation.timeframe}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2">ROI Esperado</h5>
                    <p className="text-sm text-green-700">
                      La implementación de estas medidas podría reducir el estrés estudiantil en un 
                      <strong> 15-25%</strong> en los próximos 6-12 meses, mejorando la retención 
                      estudiantil y el rendimiento académico.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Call to action */}
      <div className="mt-6 p-4 bg-blue-600 rounded-lg text-white">
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div>
            <h5 className="font-semibold">Próximos Pasos Recomendados</h5>
            <p className="text-sm text-blue-100 mt-1">
              1. Revisar presupuesto para programas de bienestar • 2. Formar comité de implementación • 3. Establecer métricas de seguimiento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
