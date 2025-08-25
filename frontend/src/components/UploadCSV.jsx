import Papa from 'papaparse'

export default function UploadCSV({ onData }){
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if(!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onData?.(results.data)
      }
    })
  }
  return (
    <label className="btn-ghost cursor-pointer">
      <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
      Cargar CSV
    </label>
  )
}
