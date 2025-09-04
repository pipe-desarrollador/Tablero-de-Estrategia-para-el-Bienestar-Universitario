// /src/pages/Reportes.jsx
// Descripción: Módulo de carga CSV y herramientas (estructura/limpieza BD).
import { useState } from 'react';
import { uploadDataset, clearData, getTableStructure } from '../lib/api';
import ContextualHelp from '../components/ContextualHelp.jsx';


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
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Carga de Datos & Reportes</h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Gestiona la carga de datasets CSV y herramientas de administración de la base de datos.
        </p>
      </div>

      {/* GRID superior: Upload + Acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Card: Subir CSV */}
        <ContextualHelp helpId="upload-csv">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Cargar Dataset (CSV)</h2>
            <p className="text-sm text-slate-600 mb-4">
              Acepta los formatos: <b>Stress_Dataset.csv</b>, <b>StressLevelDataset.csv</b> o <b>Encuestas_UCaldas.csv</b>.
            </p>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100
                             border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium
                           hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subiendo…
                  </>
                ) : (
                  'Subir Archivo'
                )}
              </button>
            </form>
            {file && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Archivo seleccionado:</span> {file.name}
                </p>
              </div>
            )}
          </div>
        </ContextualHelp>

        {/* Card: Acciones / Estructura */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Herramientas de Administración</h2>
          <div className="space-y-3">
            <button
              onClick={handleStructure}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-white text-sm font-medium hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando…' : 'Ver Estructura de Tabla'}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar Base de Datos
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            <strong>⚠️ Advertencia:</strong> Limpiar base de datos elimina todos los registros de <b>survey_responses</b>.
          </p>
        </div>
      </div>

      {/* Mensajes de error */}
      {err && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-600">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{err}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resultado de carga */}
      {resp && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Resultado de la Operación</h2>
          {'fileType' in resp || 'recordsProcessed' in resp ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KV label="Mensaje" value={resp.message || '-'} />
                <KV label="Tipo de archivo" value={resp.fileType || '-'} />
                <KV label="Registros procesados" value={resp.recordsProcessed ?? '-'} />
              </div>
              
              {/* Información de normalización */}
              {resp.normalization && resp.normalization.applied && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Normalización Automática Aplicada</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Los datos han sido normalizados automáticamente a la escala 1-5 para compatibilidad.
                      </p>
                      <div className="text-sm text-blue-600">
                        <p><strong>Valores normalizados:</strong> {resp.normalization.totalNormalized}</p>
                        <p><strong>Columnas ajustadas:</strong> {resp.normalization.normalizedColumns.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 overflow-x-auto">{JSON.stringify(resp, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* Tabla: estructura de columnas */}
      {struct.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Estructura de Tabla: survey_responses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-3 sm:px-4 py-2 font-semibold">Columna</th>
                  <th className="px-3 sm:px-4 py-2 font-semibold">Tipo de dato</th>
                  <th className="px-3 sm:px-4 py-2 font-semibold">¿Permite nulos?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {struct.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 sm:px-4 py-2 font-medium text-slate-800">{c.column_name}</td>
                    <td className="px-3 sm:px-4 py-2 text-slate-600">{c.data_type}</td>
                    <td className="px-3 sm:px-4 py-2 text-slate-600">{c.is_nullable}</td>
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
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 sm:p-4">
      <div className="text-xs sm:text-sm uppercase tracking-wide text-slate-500 font-medium">{label}</div>
      <div className="mt-1 text-sm sm:text-base text-slate-800 font-semibold">{String(value)}</div>
    </div>
  );
}
