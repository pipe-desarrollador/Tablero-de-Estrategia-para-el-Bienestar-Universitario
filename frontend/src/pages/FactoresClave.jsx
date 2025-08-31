import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getFactoresComparativo } from '../lib/api.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FactoresClave() {
  const [metric, setMetric] = useState('promedio'); // 'promedio' | 'porcentaje_ge4'
  const [labels, setLabels] = useState([]);
  const [dataAvg, setDataAvg] = useState([]);
  const [dataPct, setDataPct] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const res = await getFactoresComparativo();
        setLabels(res.labels || []);
        setDataAvg(res.promedio || []);
        setDataPct(res.porcentaje_ge4 || []);
      } catch (e) {
        setErr(e.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const datasetsForChart = useMemo(() => {
    const src = metric === 'promedio' ? dataAvg : dataPct;
    const palette = ['#2563eb', '#f59e0b', '#10b981', '#ef4444']; // por si hay más grupos en el futuro
    return (src || []).map((s, i) => ({
      label: s.name,
      data: s.data,
      backgroundColor: palette[i % palette.length],
      borderWidth: 0
    }));
  }, [metric, dataAvg, dataPct]);

  const chartData = useMemo(() => ({
    labels,
    datasets: datasetsForChart
  }), [labels, datasetsForChart]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y ?? 0;
            return metric === 'promedio'
              ? ` ${val.toFixed(2)} / 5`
              : ` ${val.toFixed(2)} %`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: metric === 'promedio' ? 5 : 100,
        title: {
          display: true,
          text: metric === 'promedio' ? 'Promedio (1–5)' : '% respuestas ≥ 4'
        }
      }
    }
  }), [metric]);

  return (
    <section>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Factores clave – Comparativo</h1>
          <p className="text-slate-600">Universidad de Caldas vs Otras universidades</p>
        </div>

        <div className="text-sm">
          <label className="mr-2 font-medium">Métrica:</label>
          <select
            className="border rounded px-2 py-1"
            value={metric}
            onChange={e => setMetric(e.target.value)}
          >
            <option value="promedio">Promedio (1–5)</option>
            <option value="porcentaje_ge4">% con respuesta ≥ 4</option>
          </select>
        </div>
      </div>

      {err && <div className="mt-3 text-red-600">{err}</div>}
      {loading && <div className="mt-3 text-slate-500">Cargando…</div>}

      {!loading && !err && (
        <>
          <div className="my-6">
            <Bar data={chartData} options={options} />
          </div>

          {/* Tabla resumen debajo del gráfico */}
          <div className="overflow-auto">
            <table className="min-w-[640px] w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Factor</th>
                  {(metric === 'promedio' ? dataAvg : dataPct).map((s) => (
                    <th key={s.name} className="text-left p-2">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labels.map((lab, idx) => (
                  <tr key={lab} className="border-b">
                    <td className="p-2">{lab}</td>
                    {(metric === 'promedio' ? dataAvg : dataPct).map((s) => (
                      <td key={s.name} className="p-2 font-mono">
                        {metric === 'promedio'
                          ? (s.data[idx] ?? 0).toFixed(2)
                          : ((s.data[idx] ?? 0).toFixed(2) + ' %')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
