// /src/components/TrendLineChart.jsx
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function TrendLineChart({
  data = [],
  height = 480,           // alto configurable
  minWidth = 900,         // ancho mínimo para evitar que se "apriete"
}) {
  // data = [{ name: 'Universidad de Caldas', data: [{x:'Sueño', y:31.2}, ...] }, ...]
  const categories = Array.from(new Set(data.flatMap(s => s.data.map(p => p.x))));

  const table = categories.map(cat => {
    const row = { x: cat };
    for (const serie of data) {
      const found = serie.data.find(p => p.x === cat);
      row[serie.name] = found ? found.y : null; // usa null para gaps reales, no 0
    }
    return row;
  });

  const lineKeys = data.map(s => s.name);

  const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span>{' '}
              {typeof entry.value === 'number' ? `${entry.value.toFixed(1)}%` : '—'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0 || table.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <div className="text-center">
          <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No hay datos disponibles para mostrar</p>
        </div>
      </div>
    );
  }

  // Contenedor con scroll horizontal y ancho mínimo para evitar "estrechez"
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={table}
            margin={{ top: 24, right: 32, left: 24, bottom: 48 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />

            <XAxis
              dataKey="x"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
              tickMargin={14}
              angle={-35}
              textAnchor="end"
              height={70}
              interval={0}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
              tickMargin={10}
              tickFormatter={(v) => (typeof v === 'number' ? `${v}%` : '')}
              domain={[0, 100]}       // como son %, esto evita que "salte" y da altura consistente
              allowDecimals={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{ paddingBottom: 8 }}
            />

            {lineKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{
                  fill: colors[index % colors.length],
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#fff',
                }}
                activeDot={{
                  r: 7,
                  stroke: colors[index % colors.length],
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
