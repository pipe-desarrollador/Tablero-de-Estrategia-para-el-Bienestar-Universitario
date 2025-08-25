import { useState } from 'react'
import UploadCSV from '../components/UploadCSV.jsx'
import { postUploadCSV } from '../lib/api.js'

export default function Reportes(){
  const [rows, setRows] = useState([])
  const [saved, setSaved] = useState(null)

  const handleSave = async () => {
    const r = await postUploadCSV(rows)
    setSaved(r)
  }

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-800">Reportes y Carga de Datos</h1>
      <p className="text-slate-600 mt-2">Carga archivos con la estructura definida y guarda la información (conecta tu API).</p>

      <div className="flex items-center gap-3 mt-4">
        <UploadCSV onData={setRows} />
        <button className="btn-primary" onClick={handleSave} disabled={!rows.length}>Guardar</button>
        {saved && <span className="text-sm text-slate-600">Guardado: {saved.ok ? 'ok' : 'error'} ({saved.count} filas)</span>}
      </div>

      <div className="card p-4 mt-6 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              {(rows[0] ? Object.keys(rows[0]) : ['No hay datos']).map((h,i)=>(<th key={i} className="py-2 pr-4">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,idx)=>(
              <tr key={idx} className="border-t border-slate-200">
                {Object.values(r).map((v,i)=>(<td key={i} className="py-2 pr-4 whitespace-nowrap">{String(v)}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
