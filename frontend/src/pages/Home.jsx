// /src/pages/Home.jsx
import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard.jsx'
import TrendLineChart from '../components/TrendLineChart.jsx'
import { Link } from 'react-router-dom'
import { getResumen, getSerie } from '/src/lib/api.js'

export default function Home(){
  const [res, setRes] = useState({ promedio: null, top: [] })
  const [serie, setSerie] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [r, s] = await Promise.all([getResumen(), getSerie()])
        if (!alive) return
        setRes(r || { promedio: null, top: [] })
        setSerie(Array.isArray(s) ? s : [])
      } catch (e) {
        console.error('Home data load error', e)
        setRes({ promedio: null, top: [] })
        setSerie([])
      }
    })()
    return () => { alive = false }
  }, [])

  const safeTop = Array.isArray(res?.top) ? res.top : []
  const safeSerie = Array.isArray(serie) ? serie : []  // 👈 evita undefined

  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight text-slate-800">
        Tablero de Estrategia para el Bienestar Universitario
      </h1>
      <p className="text-slate-600 mt-2">Visión general del estado actual y evolución del estrés estudiantil.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <KpiCard title="Promedio de estrés actual" value={res?.promedio ?? '—'} />
        
        <div className="card p-6">
          <p className="text-slate-600 text-sm">Top 3 factores críticos</p>
          <ul className="mt-3 space-y-1 text-slate-800">
            {safeTop.map((t,i)=>(<li key={i}>• {t}</li>))}
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Niveles de estrés</h2>
      {/* Si tu TrendLineChart asume series estilo Apex (array de objetos con .data), 
          envíale al menos un array vacío en ese formato para evitar .length de undefined */}
      <TrendLineChart data={safeSerie.length ? safeSerie : [{ name: 'Sin datos', data: [] }]} />

      <div className="mt-6">
        <Link to="/factores" className="btn-primary">Explorar Factores</Link>
      </div>
    </section>
  )
}