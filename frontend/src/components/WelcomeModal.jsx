// /src/components/WelcomeModal.jsx
// Descripción: Modal de bienvenida para nuevos usuarios con introducción al sistema
import { useState, useEffect } from 'react';

export default function WelcomeModal({ isOpen, onClose, onStartTour }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya ha visto la bienvenida
    const seen = localStorage.getItem('tablero-welcome-seen');
    setHasSeenWelcome(seen === 'true');
  }, []);

  const slides = [
    {
      icon: '🎯',
      title: '¡Bienvenido al Tablero de Estrategia!',
      content: 'Este sistema te ayudará a tomar decisiones informadas sobre el bienestar estudiantil universitario.',
      features: [
        'Análisis comparativo entre universidades',
        'Identificación de factores críticos de estrés',
        'Simulaciones What-If para planificación',
        'Visualizaciones interactivas y claras'
      ]
    },
    {
      icon: '📊',
      title: 'Navegación Intuitiva',
      content: 'El sistema está organizado en 5 secciones principales:',
      features: [
        '🏠 Inicio: Dashboard con KPIs y tendencias',
        '📈 Análisis Comparativo: Comparación entre universidades',
        '🎯 Factores Clave: Identificación de problemas prioritarios',
        '🔮 Simulaciones: Herramientas de planificación What-If',
        '📁 Reportes: Carga de datos y administración'
      ]
    },
    {
      icon: '💡',
      title: 'Sistema de Ayuda Integrado',
      content: 'Nunca te quedes sin ayuda:',
      features: [
        'Botón de ayuda flotante en cada página',
        'Tooltips contextuales en elementos clave',
        'Manual interactivo con tours guiados',
        'Tips rápidos específicos por sección'
      ]
    },
    {
      icon: '🚀',
      title: '¡Comencemos!',
      content: 'Estás listo para explorar el sistema. Te recomendamos:',
      features: [
        'Hacer el tour interactivo para familiarizarte',
        'Cargar datos de ejemplo en la sección Reportes',
        'Explorar las diferentes visualizaciones',
        'Probar las simulaciones What-If'
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('tablero-welcome-seen', 'true');
    onClose();
  };

  const skipWelcome = () => {
    localStorage.setItem('tablero-welcome-seen', 'true');
    onClose();
  };

  const startTour = () => {
    localStorage.setItem('tablero-welcome-seen', 'true');
    onClose();
    onStartTour();
  };

  if (!isOpen || hasSeenWelcome) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentSlideData.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentSlideData.title}
                  </h3>
                  <div className="flex gap-1 mt-1">
                    {slides.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={skipWelcome}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                {currentSlideData.content}
              </p>
              
              <div className="space-y-3">
                {currentSlideData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              <div className="flex gap-3">
                {currentSlide === slides.length - 1 ? (
                  <>
                    <button
                      onClick={startTour}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🚀 Iniciar Tour
                    </button>
                    <button
                      onClick={handleFinish}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Comenzar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={nextSlide}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Siguiente →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
