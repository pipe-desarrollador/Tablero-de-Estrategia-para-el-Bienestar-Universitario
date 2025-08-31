// /src/pages/Simulaciones.jsx
import { useEffect, useState } from 'react';
import { postWhatIf } from '../lib/api.js';

export default function Simulaciones() {
  const [tutoria, setTutoria]   = useState(0);
  const [sueno, setSueno]       = useState(0);
  const [finanzas, setFinanzas] = useState(0);
  const [eff, setEff]           = useState(0.3);
  // (opcional) filtrar por grupo
  const [grupo, setGrupo]       = useState(''); // '', 'ucaldas', 'otras'

  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState('');
  const [baseline, setBaseline] = useState(null);
  const [scenario, setScenario] = useState(null);

  // Llama al backend cuando cambian sliders (debounce 300ms)
  useEffect(() => {
    setErr('');
    setLoading(true);

    const payload = {
      filters:
        grupo === 'ucaldas' ? { university_group: 'ucaldas' } :
        grupo === 'otras'   ? { university_group: 'otras' }   : {},
      interventions: [
        { type: 'tutoria_academica', pct: tutoria },
        { type: 'salud_mental',      pct: sueno },
        { type: 'apoyo_financiero',  pct: finanzas },
      ],
      effectiveness: eff,
    };

    // debounce + cancelación para evitar “loading” atascado
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await postWhatIf(payload, { signal: ctrl.signal });
        setBaseline(res.baseline ?? null);
        setScenario(res.scenario ?? null);
      } catch (e) {
        if (e.name !== 'AbortError') setErr(e.message || 'Error llamando a /api/what-if');
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [tutoria, sueno, finanzas, eff, grupo]);

  const baseVal = baseline?.index_pct_ge4 ?? null;
  const scenVal = scenario?.index_pct_ge4 ?? null;
  const delta   = (baseVal != null && scenVal != null) ? (scenVal - baseVal) : null;

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-800">Simulaciones (What-If)</h1>
      <p className="text-slate-600 mt-2">
        Ajusta las inversiones y observa el impacto hipotético en el <b>% de respuestas ≥ 4</b> (ítems Likert).
      </p>

      {/* Filtro (opcional) */}
      <div className="mt-4">
        <label className="text-sm text-slate-700 mr-2">Universidad</label>
        <select
          value={grupo}
          onChange={(e)=>setGrupo(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">(todas)</option>
          <option value="ucaldas">Universidad de Caldas</option>
          <option value="otras">Otras universidades</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="card p-5">
          <label className="font-medium text-slate-800">Programas de tutoría académica</label>
          <input type="range" min="0" max="100" value={tutoria}
                 onChange={e=>setTutoria(+e.target.value)} className="w-full mt-3" />
          <div className="text-sm text-slate-600 mt-1">{tutoria}% inversión</div>
        </div>

        <div className="card p-5">
          <label className="font-medium text-slate-800">Higiene del sueño / salud mental</label>
          <input type="range" min="0" max="100" value={sueno}
                 onChange={e=>setSueno(+e.target.value)} className="w-full mt-3" />
          <div className="text-sm text-slate-600 mt-1">{sueno}% inversión</div>
        </div>

        <div className="card p-5">
          <label className="font-medium text-slate-800">Apoyo financiero</label>
          <input type="range" min="0" max="100" value={finanzas}
                 onChange={e=>setFinanzas(+e.target.value)} className="w-full mt-3" />
          <div className="text-sm text-slate-600 mt-1">{finanzas}% inversión</div>
        </div>
      </div>

      <div className="card p-5 mt-6">
        <label className="font-medium text-slate-800">Efectividad global del modelo</label>
        <input type="range" min="0" max="1" step="0.05" value={eff}
               onChange={e=>setEff(+e.target.value)} className="w-full mt-3" />
        <div className="text-sm text-slate-600 mt-1">{eff}</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="card p-6">
          <div className="text-slate-600 text-sm">Índice %≥4 (baseline)</div>
          <div className="text-5xl font-semibold mt-2">
            {baseVal != null ? `${baseVal.toFixed(3)}%` : '—'}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-slate-600 text-sm">
            Índice %≥4 (escenario){loading ? ' • calculando…' : ''}
          </div>
          <div className="text-5xl font-semibold mt-2">
            {scenVal != null ? `${scenVal.toFixed(3)}%` : '—'}
          </div>
          {delta != null &&
            <div className={`mt-2 text-sm ${delta <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              Δ {delta.toFixed(3)} pp
            </div>}
        </div>
      </div>

      {err && <div className="text-red-600 mt-3">{err}</div>}
      <div className="text-slate-500 text-sm mt-3">
        * Basado en tu endpoint <code>/api/what-if</code>.
      </div>
    </section>
  );
}
