import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function TrendLineChart({ data }){
  return (
    <div className="card p-4 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#2E8F72" strokeWidth={3} dot={false} name="Actual" />
          <Line type="monotone" dataKey="anterior" stroke="#94a3b8" strokeWidth={3} dot={false} name="Años anteriores" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
