import { Link, NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/analisis', label: 'Análisis Comparativo' },
  { to: '/factores', label: 'Factores Clave' },
  { to: '/simulaciones', label: 'Simulaciones' },
  { to: '/reportes', label: 'Reportes' },
]

export default function Navbar({ onOpenManual }){
  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.svg" alt="Universidad" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"/>
            <span className="font-semibold tracking-wide text-sm sm:text-base">UNIVERSIDAD</span>
          </Link>

          <nav className="hidden sm:flex gap-4 lg:gap-6 text-sm">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to} className={({isActive}) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:text-teal-200 hover:bg-slate-700 ${
                  isActive ? 'text-teal-200 bg-slate-700' : 'text-slate-100'
                }`}>
                {n.label}
              </NavLink>
            ))}
            
            {/* Botón de ayuda en desktop */}
            <button
              onClick={onOpenManual}
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:text-teal-200 hover:bg-slate-700 text-slate-100"
              title="Manual de Usuario"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button className="text-slate-100 hover:text-teal-200 focus:outline-none focus:text-teal-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to} className={({isActive}) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive ? 'text-teal-200 bg-slate-700' : 'text-slate-100 hover:text-teal-200 hover:bg-slate-700'
                }`}>
                {n.label}
              </NavLink>
            ))}
            
            {/* Botón de ayuda en mobile */}
            <button
              onClick={onOpenManual}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-slate-100 hover:text-teal-200 hover:bg-slate-700"
            >
              📖 Manual de Usuario
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
