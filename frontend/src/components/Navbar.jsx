import { Link, NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/analisis', label: 'Análisis Comparativo' },
  { to: '/factores', label: 'Factores Clave' },
  { to: '/simulaciones', label: 'Simulaciones' },
  { to: '/reportes', label: 'Reportes' },
]

export default function Navbar(){
  return (
    <header className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Universidad" className="w-8 h-8 rounded-full"/>
          <span className="font-semibold tracking-wide">UNIVERSIDAD</span>
        </Link>

        <nav className="ml-auto flex gap-6 text-sm">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} className={({isActive}) => 
              `hover:text-teal-200 ${isActive ? 'text-teal-200 font-semibold' : 'text-slate-100'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
