import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import AnalisisComparativo from './pages/AnalisisComparativo.jsx'
import FactoresClave from './pages/FactoresClave.jsx'
import Simulaciones from './pages/Simulaciones.jsx'
import Reportes from './pages/Reportes.jsx'
import NotFound from './pages/NotFound.jsx'
import InteractiveManual from './components/InteractiveManual.jsx'
import HelpButton from './components/HelpButton.jsx'
import WelcomeModal from './components/WelcomeModal.jsx'

export default function App(){
  const [isManualOpen, setIsManualOpen] = useState(false)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)

  const openManual = () => {
    setIsManualOpen(true)
  }

  const closeManual = () => {
    setIsManualOpen(false)
  }

  const openWelcome = () => {
    setIsWelcomeOpen(true)
  }

  const closeWelcome = () => {
    setIsWelcomeOpen(false)
  }

  const startTour = () => {
    setIsWelcomeOpen(false)
    setIsManualOpen(true)
  }

  return (
    <div className="min-h-screen">
      <Navbar onOpenManual={openManual} />
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
      
      {/* Sistema de ayuda */}
      <HelpButton onOpenManual={openManual} />
      <InteractiveManual 
        isOpen={isManualOpen} 
        onClose={closeManual}
        onStartTour={() => console.log('Tour iniciado')}
      />
      <WelcomeModal 
        isOpen={isWelcomeOpen} 
        onClose={closeWelcome}
        onStartTour={startTour}
      />
    </div>
  )
}
