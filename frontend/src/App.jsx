import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import AnalisisComparativo from './pages/AnalisisComparativo.jsx'
import FactoresClave from './pages/FactoresClave.jsx'
import Simulaciones from './pages/Simulaciones.jsx'
import Reportes from './pages/Reportes.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analisis" element={<AnalisisComparativo />} />
          <Route path="/factores" element={<FactoresClave />} />
          <Route path="/simulaciones" element={<Simulaciones />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/inicio" element={<Navigate to='/' replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
