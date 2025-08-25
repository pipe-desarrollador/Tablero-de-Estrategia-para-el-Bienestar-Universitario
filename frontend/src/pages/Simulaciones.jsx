import { useMemo, useState } from 'react'

// Modelo simple "what-if": reduce el promedio de estrés según % de inversión por área.
const basePromedio = 3.5

export default function Simulaciones(){
  const [tutoria, setTutoria] = useState(0)
  const [sueno, setSueno] = useState(0)
  const [finanzas, setFinanzas] = useState(0)

  const resultado = useMemo(()=>{
    // Coeficientes hipotéticos de eficacia
    const r = basePromedio - (tutoria*0.015) - (sueno*0.02) - (finanzas*0.012)
    return Math.max(0, Number(r.toFixed(2)))
  }, [tutoria, sueno, finanzas])

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-800">Simulaciones (What‑If)</h1>
      <p className="text-slate-600 mt-2">Ajusta las inversiones y observa el impacto hipotético en el promedio de estrés.</p>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="card p-5">
          <label className="font-medium text-slate-800">Programas de tutoría académica</label>
          <input type="range" min="0" max="100" value={tutoria} onChange={e=>setTutoria(+e.target.value)} className="w-full mt-3" />
          <div className="text-sm text-slate-600 mt-1">{tutoria}% inversión</div>
        </div>
        <div className="card p-5">
          <label className="font-medium text-slate-800">Higiene del sueño</label>
          <input type="range" min="0" max="100" value={sueno} onChange={e=>setSueno(+e.target.value)} className="w-full mt-3" />
          <div className="text-sm text-slate-600 mt-1">{sueno}% inversión</div>
        </div>
        <div className="card p-5">
          <label className="font-medium text-slate-800">Apoyo financiero</label>
          <input type="range" min="0" max="100" value={finanzas} onChange={e=>setFinanzas(+e.target.value)} className="w-full mt-3" />
          <div className="text-sm text-slate-600 mt-1">{finanzas}% inversión</div>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <div className="text-slate-600 text-sm">Promedio de estrés estimado</div>
        <div className="text-5xl font-semibold mt-2">{resultado}</div>
        <div className="text-slate-500 text-sm mt-2">Base: {basePromedio}. Cambia los deslizadores para simular escenarios.</div>
      </div>
    </section>
  )
}
