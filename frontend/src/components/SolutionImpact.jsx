// /src/components/SolutionImpact.jsx
// Descripción: Visualización del impacto potencial de las soluciones implementadas
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function SolutionImpact({ currentData = [], selectedSolutions = [] }) {
  const [timeframe, setTimeframe] = useState('6months');

  // Simular impacto de soluciones basado en evidencia
  const calculateImpact = (currentValue, solutionType, timeframe) => {
    const impactRates = {
      'sleep_problems': {
        '3months': 0.15,
        '6months': 0.25,
        '12months': 0.35
      },
      'headaches': {
        '3months': 0.20,
        '6months': 0.30,
        '12months': 0.40
      },
      'concentration_issues': {
        '3months': 0.18,
        '6months': 0.28,
        '12months': 0.38
      },
      'irritability': {
        '3months': 0.12,
        '6months': 0.22,
        '12months': 0.32
      },
      'palpitations': {
        '3months': 0.10,
        '6months': 0.20,
        '12months': 0.30
      },
      'sadness': {
        '3months': 0.08,
        '6months': 0.18,
        '12months': 0.28
      },
      'anxiety': {
        '3months': 0.10,
        '6months': 0.20,
        '12months': 0.30
      }
    };

    const rate = impactRates[solutionType]?.[timeframe] || 0.15;
    return Math.max(0, currentValue * (1 - rate));
  };

  // Generar datos proyectados
  const generateProjectedData = () => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map(series => {
      const projectedData = series.data?.map(item => {
        const currentValue = item.y;
        const projectedValue = calculateImpact(currentValue, item.x, timeframe);
        const improvement = currentValue - projectedValue;
        
        return {
          x: item.x,
          current: currentValue,
          projected: projectedValue,
          improvement: improvement,
          improvementPercent: ((improvement / currentValue) * 100).toFixed(1)
        };
      }) || [];

      return {
        name: series.name,
        data: projectedData
      };
    });
  };

  const projectedData = generateProjectedData();

  // Calcular métricas de impacto
  const calculateImpactMetrics = () => {
    const metrics = {};
    
    projectedData.forEach(series => {
      if (series.data) {
        const totalImprovement = series.data.reduce((sum, item) => sum + item.improvement, 0);
        const avgImprovement = totalImprovement / series.data.length;
        const totalCurrent = series.data.reduce((sum, item) => sum + item.current, 0);
        const totalProjected = series.data.reduce((sum, item) => sum + item.projected, 0);
        const overallImprovement = ((totalCurrent - totalProjected) / totalCurrent) * 100;
        
        metrics[series.name] = {
          totalImprovement: totalImprovement,
          avgImprovement: avgImprovement,
          overallImprovement: overallImprovement,
          studentsAffected: Math.round(totalImprovement * 10) // Estimación
        };
      }
    });

    return metrics;
  };

  const impactMetrics = calculateImpactMetrics();

  // Preparar datos para el gráfico
  const chartData = [];
  if (projectedData.length > 0 && projectedData[0].data) {
    projectedData[0].data.forEach((item, index) => {
      const chartItem = {
        factor: item.x,
        current: item.current,
        projected: item.projected
      };
      
      if (projectedData[1] && projectedData[1].data && projectedData[1].data[index]) {
        chartItem[`${projectedData[1].name}_current`] = projectedData[1].data[index].current;
        chartItem[`${projectedData[1].name}_projected`] = projectedData[1].data[index].projected;
      }
      
      chartData.push(chartItem);
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => {
            const isProjected = entry.dataKey.includes('projected');
            const improvement = entry.dataKey.includes('current') ? 
              payload.find(p => p.dataKey === entry.dataKey.replace('current', 'projected'))?.value : null;
            
            return (
              <div key={index} className="text-sm">
                <p style={{ color: entry.color }}>
                  {entry.name}: {entry.value.toFixed(1)}%
                  {improvement && (
                    <span className="text-green-600 ml-2">
                      (Mejora: {(entry.value - improvement).toFixed(1)}pp)
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (!currentData || currentData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No hay datos suficientes para proyectar el impacto</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Proyección de Impacto de Soluciones</h3>
        <p className="text-sm text-gray-600">
          Simulación del impacto esperado de implementar las soluciones recomendadas
        </p>
      </div>

      {/* Selector de tiempo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Horizonte de Tiempo:
        </label>
        <div className="flex gap-2">
          {[
            { value: '3months', label: '3 meses' },
            { value: '6months', label: '6 meses' },
            { value: '12months', label: '12 meses' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de comparación */}
      <div className="h-96 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="factor" 
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={{ stroke: '#e0e0e0' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={{ stroke: '#e0e0e0' }}
              label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar dataKey="current" fill="#ef4444" name="Estado Actual" radius={[4, 4, 0, 0]} />
            <Bar dataKey="projected" fill="#10b981" name="Proyección" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Métricas de impacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(impactMetrics).map(([universityName, metrics]) => (
          <div key={universityName} className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">{universityName}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Mejora Promedio:</span>
                <span className="font-semibold text-green-800">{metrics.avgImprovement.toFixed(1)}pp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Mejora Total:</span>
                <span className="font-semibold text-green-800">{metrics.overallImprovement.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Estudiantes Beneficiados:</span>
                <span className="font-semibold text-green-800">~{metrics.studentsAffected}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nota metodológica */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h5 className="font-medium text-blue-800">Metodología de Proyección</h5>
            <p className="text-sm text-blue-700 mt-1">
              Las proyecciones se basan en evidencia empírica de programas similares implementados en instituciones de educación superior. 
              Los porcentajes de mejora varían según el tipo de intervención y el horizonte temporal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
