import { useEffect, useState } from 'react'
import FactorsBubbleChart from '../components/FactorsBubbleChart.jsx'
import { getFactores } from '../lib/api.js'

export default function FactoresClave(){
  const [data, setData] = useState([])
  useEffect(()=>{ getFactores().then(setData) },[])

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-800">Factores Clave</h1>
      <p className="text-slate-600 mt-2">Explora el impacto, prevalencia y población afectada por cada factor.</p>
      <div className="mt-6">
        <FactorsBubbleChart data={data} />
      </div>
      <div className="mt-3 text-sm text-slate-600">Impacto (x), Prevalencia (y), Tamaño de población (burbuja).</div>
    </section>
  )
}
