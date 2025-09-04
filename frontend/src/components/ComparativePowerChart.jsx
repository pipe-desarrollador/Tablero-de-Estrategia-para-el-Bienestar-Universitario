// /src/components/ComparativePowerChart.jsx
// Descripción: Gráfico de barras estilo PowerBI para análisis comparativo
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import StressSolutions from './StressSolutions.jsx';

export default function ComparativePowerChart({ data = [] }) {
  // Colores estilo PowerBI
  const colors = {
    'Universidad de Caldas': '#1f77b4', // Azul corporativo
    'Otras universidades': '#ff7f0e'    // Naranja contrastante
  };

  // Transformar datos para el gráfico de barras
  const chartData = [];
  if (data.length > 0) {
    const firstSeries = data[0];
    if (firstSeries && firstSeries.data) {
      firstSeries.data.forEach((item, index) => {
        const chartItem = {
          name: item.x,
          [firstSeries.name]: item.y
        };
        
        // Agregar datos de la segunda serie si existe
        if (data[1] && data[1].data && data[1].data[index]) {
          chartItem[data[1].name] = data[1].data[index].y;
        }
        
        chartData.push(chartItem);
      });
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Niveles de Estrés por Universidad</h3>
        <p className="text-sm text-gray-600">Comparación de factores de estrés (% de respuestas ≥ 4)</p>
      </div>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
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
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            
            {data.map((series, index) => (
              <Bar 
                key={series.name}
                dataKey={series.name} 
                fill={colors[series.name] || `hsl(${index * 60}, 70%, 50%)`}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                {chartData.map((entry, entryIndex) => (
                  <Cell 
                    key={`cell-${entryIndex}`} 
                    fill={colors[series.name] || `hsl(${index * 60}, 70%, 50%)`}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Estadísticas resumidas */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((series, index) => {
          const avgValue = series.data?.reduce((sum, item) => sum + item.y, 0) / (series.data?.length || 1);
          const maxValue = Math.max(...(series.data?.map(item => item.y) || [0]));
          const maxFactor = series.data?.find(item => item.y === maxValue)?.x || 'N/A';
          
          return (
            <div key={series.name} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2" style={{ color: colors[series.name] }}>
                {series.name}
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Promedio: <span className="font-medium">{avgValue.toFixed(1)}%</span></p>
                <p>Factor más alto: <span className="font-medium">{maxFactor}</span></p>
                <p>Máximo: <span className="font-medium">{maxValue.toFixed(1)}%</span></p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Soluciones Dinámicas para el Factor Crítico */}
      <div className="mt-8">
        <StressSolutions data={data} universityGroup="ambas universidades" />
      </div>
    </div>
  );
}