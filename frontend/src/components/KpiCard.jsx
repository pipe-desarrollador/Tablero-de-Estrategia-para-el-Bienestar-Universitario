export default function KpiCard({ title, value, subtitle }){
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 h-full">
      <p className="text-slate-600 text-xs sm:text-sm font-medium">{title}</p>
      <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-slate-800">
        {value}
      </div>
      {subtitle && <p className="mt-1 sm:mt-2 text-slate-500 text-xs sm:text-sm">{subtitle}</p>}
    </div>
  )
}
