// /src/pages/Home.jsx
// Descripción: Pantalla principal del tablero; muestra KPIs y tendencias.
import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard.jsx'
import TrendLineChart from '../components/TrendLineChart.jsx'
import { Link } from 'react-router-dom'
import { getResumen, getSerie } from '/src/lib/api.js'
import ContextualHelp from '../components/ContextualHelp.jsx'

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
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-800">
          Tablero de Estrategia para el Bienestar Universitario
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">Visión general del estado actual y evolución del estrés estudiantil.</p>
      </div>

      <ContextualHelp helpId="kpi-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <KpiCard title="Promedio de estrés actual" value={res?.promedio ?? '—'} />
          
          <div className="sm:col-span-2 lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <p className="text-slate-600 text-sm font-medium">Top 3 factores críticos</p>
            <ul className="mt-3 space-y-2 text-slate-800">
              {safeTop.map((t,i)=>(
                <li key={i} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ContextualHelp>

      <ContextualHelp helpId="trend-chart">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-slate-800">Niveles de estrés</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <TrendLineChart data={safeSerie.length ? safeSerie : [{ name: 'Sin datos', data: [] }]} />
          </div>
        </div>
      </ContextualHelp>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/factores" className="btn-primary text-center sm:text-left">
          Explorar Factores
        </Link>
        <Link to="/analisis" className="btn-secondary text-center sm:text-left">
          Ver Análisis Comparativo
        </Link>
      </div>
    </section>
  )
}