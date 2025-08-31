// /src/pages/Reportes.jsx
import { useState } from 'react';
import { postUploadCSV, clearDatabase, getTableStructure } from '../lib/api.js';


export default function Reportes() {
  const [file, setFile] = useState(null);
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState('');

  async function handleUpload(e) {
    e.preventDefault();
    try {
      setErr('');
      setResp(null);
      if (!file) throw new Error('Selecciona un archivo CSV');
      const r = await postUploadCSV(file);
      setResp(r);
    } catch (e) {
      setErr(e.message || 'Error subiendo CSV');
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">Cargar dataset (CSV)</h1>
      <form onSubmit={handleUpload} className="mt-3 flex gap-3 items-center">
        <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">Subir</button>
      </form>

      {err && <div className="mt-3 text-red-600">{err}</div>}
      {resp && (
        <pre className="mt-3 p-3 bg-slate-100 rounded text-sm text-slate-800">
{JSON.stringify(resp, null, 2)}
        </pre>
      )}
    </section>
  );
}
