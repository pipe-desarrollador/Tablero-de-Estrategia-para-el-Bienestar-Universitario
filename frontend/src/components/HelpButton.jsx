// /src/components/HelpButton.jsx
// Descripción: Botón flotante de ayuda que aparece en todas las páginas
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const HELP_QUICK_TIPS = {
  '/': {
    title: 'Página de Inicio',
    tips: [
      'Las tarjetas KPI muestran métricas clave del bienestar estudiantil',
      'El gráfico de tendencias muestra la evolución del estrés en el tiempo',
      'Usa los botones de navegación para explorar diferentes secciones'
    ]
  },
  '/analisis': {
    title: 'Análisis Comparativo',
    tips: [
      'Compara el rendimiento entre Universidad de Caldas y otras universidades',
      'El resumen ejecutivo proporciona recomendaciones estratégicas',
      'Los gráficos muestran diferencias en niveles de estrés'
    ]
  },
  '/factores': {
    title: 'Factores Clave',
    tips: [
      'Identifica qué factores causan más estrés en los estudiantes',
      'Compara promedios Likert y porcentajes de respuestas altas',
      'Factores con valores altos requieren atención prioritaria'
    ]
  },
  '/simulaciones': {
    title: 'Simulaciones',
    tips: [
      'Ajusta los sliders para simular diferentes inversiones',
      'Observa cómo cambia el índice %≥4 con las intervenciones',
      'Usa el filtro por universidad para análisis específicos'
    ]
  },
  '/reportes': {
    title: 'Carga de Datos',
    tips: [
      'Sube archivos CSV con datos de encuestas de estrés',
      'El sistema normaliza automáticamente diferentes escalas',
      'Usa "Limpiar BD" con precaución - elimina todos los datos'
    ]
  }
};

export default function HelpButton({ onOpenManual }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
  const location = useLocation();
  
  const currentTips = HELP_QUICK_TIPS[location.pathname] || HELP_QUICK_TIPS['/'];

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  const openManual = () => {
    setIsOpen(false);
    onOpenManual();
  };

  const toggleQuickTips = () => {
    setShowQuickTips(!showQuickTips);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante de ayuda */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="relative">
          {/* Quick Tips Panel */}
          {showQuickTips && (
            <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{currentTips.title}</h4>
                <button
                  onClick={() => setShowQuickTips(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {currentTips.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu de ayuda */}
          {isOpen && (
            <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <div className="space-y-3">
                <button
                  onClick={openManual}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900">Manual Completo</div>
                    <div className="text-xs text-gray-500">Tour guiado paso a paso</div>
                  </div>
                </button>

                <button
                  onClick={toggleQuickTips}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900">Tips Rápidos</div>
                    <div className="text-xs text-gray-500">Consejos para esta sección</div>
                  </div>
                </button>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Tablero de Estrategia v1.0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón principal */}
          <button
            onClick={toggleHelp}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            {/* Indicador de notificación */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">?</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
