// /src/pages/Factores.jsx
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
    <section>
      <h1 className="text-3xl font-bold text-slate-800">Factores clave</h1>
      <p className="text-slate-600 mt-2">
        Comparativo por grupo de universidad: promedio Likert y porcentaje de respuestas ≥ 4.
      </p>

      {err && <div className="mt-4 text-red-600">{err}</div>}
      {loading && <div className="mt-4 text-slate-600">Cargando…</div>}

      {!loading && !err && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="card p-4 border border-slate-200 rounded-lg bg-white">
            {hasDataProm ? (
              <Chart type="bar" height={320} options={optsProm} series={seriesProm} />
            ) : (
              <div className="text-slate-500 text-sm">Sin datos para promedios.</div>
            )}
          </div>

          <div className="card p-4 border border-slate-200 rounded-lg bg-white">
            {hasDataPct ? (
              <Chart type="bar" height={320} options={optsPct} series={seriesPct} />
            ) : (
              <div className="text-slate-500 text-sm">Sin datos para %≥4.</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
