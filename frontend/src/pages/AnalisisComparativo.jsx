// /src/pages/AnalisisComparativo.jsx
// Descripción: Página de análisis comparativo (%≥4) entre grupos.
import { useEffect, useState } from 'react';
import ComparativePowerChart from '../components/ComparativePowerChart.jsx';
import ExecutiveSummary from '../components/ExecutiveSummary.jsx';
import SolutionImpact from '../components/SolutionImpact.jsx';
import { getSerie } from '../lib/api.js';

export default function AnalisisComparativo() {
  const [serie, setSerie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const s = await getSerie();   // mismo endpoint /api/compare/likert-ge4
        setSerie(Array.isArray(s) ? s : []);
      } catch (e) {
        setErr(e.message || 'Error cargando serie');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Análisis Comparativo</h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Compara la proporción de respuestas ≥4 (escala 1–5) entre Universidad de Caldas y otras universidades.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Cargando datos...</p>
          </div>
        </div>
      )}
      
      {err && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-600">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
              <p className="text-sm text-red-700 mt-1">{err}</p>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !err && (
        <div className="space-y-8">
          <ComparativePowerChart data={serie} />
          <SolutionImpact currentData={serie} />
          <ExecutiveSummary data={serie} />
        </div>
      )}

      <div className="mt-6 text-xs sm:text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
        <strong>Fuente:</strong> <code className="bg-white px-2 py-1 rounded text-xs">/api/compare/likert-ge4</code>
      </div>
    </section>
  );
}
