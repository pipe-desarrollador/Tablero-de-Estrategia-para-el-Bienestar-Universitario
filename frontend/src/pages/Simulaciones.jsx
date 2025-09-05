// /src/pages/Simulaciones.jsx
// Descripción: Simulación What‑If con intervenciones y filtros opcionales.
import { useEffect, useState } from 'react';
import { postWhatIf, postWhatIfBayesian, postWhatIfBayesianFull } from '../lib/api.js';
import ContextualHelp from '../components/ContextualHelp.jsx';
import BayesianExplanation from '../components/BayesianExplanation.jsx';
import BayesianMathExplanation from '../components/BayesianMathExplanation.jsx';
import RealTimeBayesianAnalysis from '../components/RealTimeBayesianAnalysis.jsx';

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

  // Estados para simulación bayesiana
  const [bayesianMode, setBayesianMode] = useState(false);
  const [bayesianTarget, setBayesianTarget] = useState('wellbeing_index');
  const [bayesianLoading, setBayesianLoading] = useState(false);
  const [bayesianError, setBayesianError] = useState('');
  const [bayesianResult, setBayesianResult] = useState(null);
  const [fullSimulation, setFullSimulation] = useState(false);

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

  // Función para ejecutar simulación bayesiana
  const runBayesianSimulation = async () => {
    setBayesianError('');
    setBayesianLoading(true);
    setBayesianResult(null);

    try {
      const interventions = {};
      if (tutoria > 0) interventions.tutoria_academica = `${tutoria}%`;
      if (sueno > 0) interventions.salud_mental = `${sueno}%`;
      if (finanzas > 0) interventions.apoyo_financiero = `${finanzas}%`;

      let result;
      if (fullSimulation) {
        result = await postWhatIfBayesianFull({ interventions });
      } else {
        result = await postWhatIfBayesian({ 
          interventions, 
          target: bayesianTarget, 
          includeExplanation: true 
        });
      }
      
      setBayesianResult(result);
    } catch (error) {
      setBayesianError(error.message || 'Error en simulación bayesiana');
    } finally {
      setBayesianLoading(false);
    }
  };

  const baseVal = baseline?.index_pct_ge4 ?? null;
  const scenVal = scenario?.index_pct_ge4 ?? null;
  const delta   = (baseVal != null && scenVal != null) ? (scenVal - baseVal) : null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Simulaciones (What-If)</h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Ajusta las inversiones y observa el impacto hipotético en el <b>% de respuestas ≥ 4</b> (ítems Likert).
        </p>
      </div>

      {/* Filtro (opcional) */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Filtrar por Universidad</label>
          <select
            value={grupo}
            onChange={(e)=>setGrupo(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las universidades</option>
            <option value="ucaldas">Universidad de Caldas</option>
            <option value="otras">Otras universidades</option>
          </select>
        </div>
      </div>

      {/* Explicación Matemática Bayesiana */}
      <div className="mb-6">
        <BayesianMathExplanation />
      </div>

      <ContextualHelp helpId="simulation-slider">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <label className="block font-medium text-slate-800 text-sm sm:text-base mb-3">
              Programas de tutoría académica
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={tutoria}
              onChange={e=>setTutoria(+e.target.value)} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs sm:text-sm text-slate-600">0%</span>
              <span className="text-sm sm:text-base font-semibold text-blue-600">{tutoria}%</span>
              <span className="text-xs sm:text-sm text-slate-600">100%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <label className="block font-medium text-slate-800 text-sm sm:text-base mb-3">
              Higiene del sueño / salud mental
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sueno}
              onChange={e=>setSueno(+e.target.value)} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs sm:text-sm text-slate-600">0%</span>
              <span className="text-sm sm:text-base font-semibold text-blue-600">{sueno}%</span>
              <span className="text-xs sm:text-sm text-slate-600">100%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <label className="block font-medium text-slate-800 text-sm sm:text-base mb-3">
              Apoyo financiero
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={finanzas}
              onChange={e=>setFinanzas(+e.target.value)} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs sm:text-sm text-slate-600">0%</span>
              <span className="text-sm sm:text-base font-semibold text-blue-600">{finanzas}%</span>
              <span className="text-xs sm:text-sm text-slate-600">100%</span>
            </div>
          </div>
        </div>
      </ContextualHelp>

      {/* Análisis Bayesiano en Tiempo Real */}
      <RealTimeBayesianAnalysis
        tutoria={tutoria}
        sueno={sueno}
        finanzas={finanzas}
        eff={eff}
        scenarioValue={scenVal}
        baselineValue={baseVal}
        delta={delta}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
        <label className="block font-medium text-slate-800 text-sm sm:text-base mb-3">
          Efectividad global del modelo
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={eff}
          onChange={e=>setEff(+e.target.value)} 
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs sm:text-sm text-slate-600">0%</span>
          <span className="text-sm sm:text-base font-semibold text-green-600">{(eff * 100).toFixed(0)}%</span>
          <span className="text-xs sm:text-sm text-slate-600">100%</span>
        </div>
      </div>

    

      <ContextualHelp helpId="baseline-scenario">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="text-slate-600 text-xs sm:text-sm font-medium">Índice %≥4 (baseline)</div>
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-2 text-slate-800">
              {baseVal != null ? `${baseVal.toFixed(3)}%` : '—'}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="text-slate-600 text-xs sm:text-sm font-medium">
              Índice %≥4 (escenario){loading ? ' • calculando…' : ''}
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-2 text-slate-800">
              {scenVal != null ? `${scenVal.toFixed(3)}%` : '—'}
            </div>
            {delta != null && (
              <div className={`mt-2 text-sm font-medium ${delta <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Δ {delta.toFixed(3)} pp
              </div>
            )}
          </div>
        </div>
      </ContextualHelp>

      
      
      <div className="text-slate-500 text-xs sm:text-sm bg-slate-50 rounded-lg p-3">
        <strong>Fuente:</strong> <code className="bg-white px-2 py-1 rounded text-xs">/api/what-if</code>
      </div>
    </section>
  );
}
