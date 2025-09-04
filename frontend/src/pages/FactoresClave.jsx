// /src/pages/FactoresClave.jsx
// Descripción: Visualiza factores clave (promedio Likert y %≥4) por grupo.
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getFactoresClave } from '../lib/api.js';

export default function Factores() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [categories, setCategories] = useState([]);
  const [seriesProm, setSeriesProm] = useState([]);
  const [seriesPct, setSeriesPct] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr('');
        setLoading(true);
        const r = await getFactoresClave();
        console.debug('[Factores] API response:', r); // 👈 DEBUG
        if (!alive) return;

        setCategories(Array.isArray(r.categories) ? r.categories : []);
        setSeriesProm(Array.isArray(r.seriesProm) ? r.seriesProm : []);
        setSeriesPct(Array.isArray(r.seriesPct) ? r.seriesPct : []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || 'Error cargando factores clave');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const baseOpts = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: categories ?? [] },
    legend: { position: 'top' },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
    noData: { text: 'Sin datos para mostrar' }, // 👈 MUY ÚTIL
  };

  const optsProm = {
    ...baseOpts,
    title: { text: 'Promedio Likert (1–5)', style: { fontWeight: 600 } },
    yaxis: { min: 0, max: 5, tickAmount: 5 },
    plotOptions: { bar: { columnWidth: '55%' } },
  };

  const optsPct = {
    ...baseOpts,
    title: { text: '% de respuestas ≥ 4', style: { fontWeight: 600 } },
    yaxis: { min: 0, max: 100, tickAmount: 5, labels: { formatter: (v) => `${v}%` } },
    tooltip: { y: { formatter: (v) => `${v}%` } },
    plotOptions: { bar: { columnWidth: '55%' } },
  };

  // Si todo es 0, Apex dibuja “sin barras”; mostramos un fallback textual:
  const hasDataProm = Array.isArray(seriesProm) && seriesProm.some(s => s.data?.some(v => Number(v) > 0));
  const hasDataPct  = Array.isArray(seriesPct)  && seriesPct.some(s => s.data?.some(v => Number(v) > 0));

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Factores Clave</h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Comparativo por grupo de universidad: promedio Likert y porcentaje de respuestas ≥ 4.
        </p>
      </div>

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
      
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Cargando factores...</p>
          </div>
        </div>
      )}

      {!loading && !err && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Promedio Likert (1–5)</h3>
            {hasDataProm ? (
              <Chart type="bar" height={320} options={optsProm} series={seriesProm} />
            ) : (
              <div className="flex items-center justify-center h-80 text-slate-500">
                <div className="text-center">
                  <svg className="h-12 w-12 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Sin datos para promedios</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">% de respuestas ≥ 4</h3>
            {hasDataPct ? (
              <Chart type="bar" height={320} options={optsPct} series={seriesPct} />
            ) : (
              <div className="flex items-center justify-center h-80 text-slate-500">
                <div className="text-center">
                  <svg className="h-12 w-12 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Sin datos para %≥4</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
