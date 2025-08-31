// /src/components/TrendLineChart.jsx
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function TrendLineChart({ data = [] }) {
  // data = [{ name: 'Universidad de Caldas', data: [{x:'Sueño', y:31.2}, ...] }, ...]
  // Convertimos a formato tabla por categoría: [{x:'Sueño', 'Universidad de Caldas':31.2, 'Otras universidades':27.1}, ...]
  const categories = Array.from(
    new Set(data.flatMap(s => s.data.map(p => p.x)))
  );

  const table = categories.map(cat => {
    const row = { x: cat };
    for (const serie of data) {
      const found = serie.data.find(p => p.x === cat);
      row[serie.name] = found ? found.y : 0;
    }
    return row;
  });

  const lineKeys = data.map(s => s.name);

  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer>
        <LineChart data={table} margin={{ top: 12, right: 24, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis unit="%" />
          <Tooltip formatter={(v)=> `${v}%`} />
          <Legend />
          {lineKeys.map((k, idx) => (
            <Line key={k} type="monotone" dataKey={k} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
