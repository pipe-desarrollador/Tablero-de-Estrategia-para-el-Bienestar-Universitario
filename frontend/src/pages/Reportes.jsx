// /src/pages/Reportes.jsx
import { useState } from 'react';
import { uploadDataset, clearData, getTableStructure } from '../lib/api';


export default function Reportes() {
  const [file, setFile] = useState(null);
  const [resp, setResp] = useState(null);
  const [struct, setStruct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleUpload(e) {
    e.preventDefault();
    setErr('');
    setResp(null);
    if (!file) return setErr('Selecciona un archivo CSV');
    setLoading(true);
    try {
      const r = await uploadDataset(file);
      setResp(r);
    } catch (e) {
      setErr(e.message || 'Error subiendo CSV');
    } finally {
      setLoading(false);
    }
  }

  async function handleStructure() {
    setErr('');
    setLoading(true);
    try {
      const r = await getTableStructure();
      setStruct(r?.survey_responses || []);
    } catch (e) {
      setErr(e.message || 'No se pudo obtener estructura');
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    if (!confirm('¿Seguro que deseas borrar TODOS los datos?')) return;
    setErr('');
    setLoading(true);
    try {
      const r = await clearData();
      setResp(r);
    } catch (e) {
      setErr(e.message || 'No se pudo limpiar la base de datos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Carga de datos & Reportes</h1>

      {/* GRID superior: Upload + Acciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Subir CSV */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Cargar dataset (CSV)</h2>
          <p className="text-sm text-slate-500 mt-1">
            Acepta los formatos: <b>Stress_Dataset.csv</b>, <b>StressLevelDataset.csv</b> o <b>Encuestas_UCaldas.csv</b>.
          </p>
          <form onSubmit={handleUpload} className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200
                         w-full sm:w-auto"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium
                         hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Subiendo…' : 'Subir'}
            </button>
          </form>
          {file && (
            <p className="text-xs text-slate-500 mt-2">
              Archivo seleccionado: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Card: Acciones / Estructura */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Herramientas</h2>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStructure}
              disabled={loading}
              className="rounded-md bg-slate-800 px-4 py-2 text-white text-sm font-medium hover:bg-slate-900 disabled:opacity-50"
            >
              {loading ? 'Cargando…' : 'Ver estructura de tabla'}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              Limpiar base de datos
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            * Limpiar base de datos elimina todos los registros de <b>survey_responses</b>.
          </p>
        </div>
      </div>

      {/* Mensajes */}
      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {/* Resultado de carga */}
      {resp && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Resultado</h2>
          {'fileType' in resp || 'recordsProcessed' in resp ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <KV label="Mensaje" value={resp.message || '-'} />
              <KV label="Tipo de archivo" value={resp.fileType || '-'} />
              <KV label="Registros procesados" value={resp.recordsProcessed ?? '-'} />
            </div>
          ) : (
            <pre className="text-sm bg-slate-50 p-3 rounded">{JSON.stringify(resp, null, 2)}</pre>
          )}
        </div>
      )}

      {/* Tabla: estructura de columnas */}
      {struct.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Estructura de tabla: survey_responses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-2 font-semibold">Columna</th>
                  <th className="px-4 py-2 font-semibold">Tipo de dato</th>
                  <th className="px-4 py-2 font-semibold">¿Permite nulos?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {struct.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-800">{c.column_name}</td>
                    <td className="px-4 py-2">{c.data_type}</td>
                    <td className="px-4 py-2">{c.is_nullable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

// Componente pequeño para pares clave/valor bonitos
function KV({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-slate-800">{String(value)}</div>
    </div>
  );
}
