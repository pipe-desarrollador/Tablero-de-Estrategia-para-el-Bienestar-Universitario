import { useEffect, useState } from 'react'
import TrendLineChart from '../components/TrendLineChart.jsx'
import { getSerie } from '../lib/api.js'

export default function AnalisisComparativo(){
  const [serie, setSerie] = useState([])

  useEffect(()=>{ getSerie().then(setSerie) },[])

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-800">Análisis Comparativo</h1>
      <p className="text-slate-600 mt-2">Compara la evolución del estrés con periodos anteriores o con otras instituciones (cuando haya datos).</p>
      <TrendLineChart data={serie} />
      <div className="mt-4 text-sm text-slate-600">* Conecta tu API para cambiar las series mostradas dinamicamente.</div>
    </section>
  )
}
