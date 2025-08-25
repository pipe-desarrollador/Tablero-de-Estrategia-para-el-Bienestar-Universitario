export default function KpiCard({ title, value, subtitle }){
  return (
    <div className="card p-6">
      <p className="text-slate-600 text-sm">{title}</p>
      <div className="mt-3 text-5xl font-semibold tracking-tight">{value}</div>
      {subtitle && <p className="mt-2 text-slate-500 text-sm">{subtitle}</p>}
    </div>
  )
}
