import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard.jsx'
import TrendLineChart from '../components/TrendLineChart.jsx'
import { Link } from 'react-router-dom'
import { getResumen } from '/src/lib/api.js';
import { getSerie } from '/src/lib/api.js';



export default function Home(){
  const [res, setRes] = useState(null)
  const [serie, setSerie] = useState([])

  useEffect(() => {
    getResumen().then(setRes)
    getSerie().then(setSerie)
  }, [])

  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight text-slate-800">
        Tablero de Estrategia para el Bienestar Universitario
      </h1>
      <p className="text-slate-600 mt-2">Visión general del estado actual y evolución del estrés estudiantil.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <KpiCard title="Promedio de estrés actual" value={res ? res.promedio : '—'} />
        <KpiCard title="Comparación con años anteriores" value={res ? `${Math.round(res.variacion*100)}%` : '—'} />
        <div className="card p-6">
          <p className="text-slate-600 text-sm">Top 3 factores críticos</p>
          <ul className="mt-3 space-y-1 text-slate-800">
            {(res?.top || []).map((t,i)=>(<li key={i}>• {t}</li>))}
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Niveles de estrés</h2>
      <TrendLineChart data={serie} />

      <div className="mt-6">
        <Link to="/factores" className="btn-primary">Explorar Factores</Link>
      </div>
    </section>
  )
}
