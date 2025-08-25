import { ResponsiveContainer, ScatterChart, ZAxis, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, Legend } from 'recharts'

// x: impacto, y: prevalencia, z: tamaño de población afectada
export default function FactorsBubbleChart({ data }){
  return (
    <div className="card p-4 h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="impacto" name="Impacto" domain={[0, 10]} />
          <YAxis type="number" dataKey="prevalencia" name="Prevalencia" domain={[0, 10]} />
          <ZAxis type="number" dataKey="poblacion" range={[60, 400]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Factores" data={data} fill="#2E8F72" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
