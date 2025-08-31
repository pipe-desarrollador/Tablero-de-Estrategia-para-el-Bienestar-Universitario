// /src/pages/AnalisisComparativo.jsx
import { useEffect, useState } from 'react';
import TrendLineChart from '../components/TrendLineChart.jsx';
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
        const s = await getSerie();
        setSerie(s);
      } catch (e) {
        setErr(e.message || 'Error cargando serie');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-800">Análisis Comparativo</h1>
      <p className="text-slate-600 mt-2">
        Compara la proporción de respuestas ≥4 (escala 1–5) entre Universidad de Caldas y otras universidades.
      </p>

      {loading && <div className="mt-4 text-slate-500">Cargando…</div>}
      {err && <div className="mt-4 text-red-600">Error: {err}</div>}

      {!loading && !err && <TrendLineChart data={serie} />}

      <div className="mt-4 text-sm text-slate-600">
        * Fuente: <code>/api/compare/likert-ge4</code>
      </div>
    </section>
  );
}
