// /src/components/InteractiveManual.jsx
// Descripción: Manual de usuario interactivo con tour guiado y ayuda contextual
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MANUAL_SECTIONS = {
  '/': {
    title: 'Página de Inicio',
    icon: '🏠',
    description: 'Dashboard principal con métricas clave y resumen ejecutivo',
    steps: [
      {
        id: 'welcome',
        title: '¡Bienvenido al Tablero de Estrategia!',
        content: 'Esta es tu página de inicio donde encontrarás un resumen completo del estado del bienestar estudiantil.',
        target: '.text-2xl',
        position: 'bottom'
      },
      {
        id: 'kpi-cards',
        title: 'Tarjetas de KPIs',
        content: 'Aquí verás el promedio de estrés actual y los 3 factores más críticos que afectan a los estudiantes.',
        target: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3',
        position: 'bottom'
      },
      {
        id: 'trend-chart',
        title: 'Gráfico de Tendencias',
        content: 'Este gráfico muestra la evolución de los niveles de estrés a lo largo del tiempo.',
        target: '.bg-white.rounded-xl.shadow-sm',
        position: 'top'
      },
      {
        id: 'navigation-buttons',
        title: 'Navegación Rápida',
        content: 'Usa estos botones para explorar los factores clave o ver análisis comparativos.',
        target: '.flex.flex-col.sm\\:flex-row.gap-4',
        position: 'top'
      }
    ]
  },
  '/analisis': {
    title: 'Análisis Comparativo',
    icon: '📊',
    description: 'Compara el rendimiento entre Universidad de Caldas y otras universidades',
    steps: [
      {
        id: 'comparative-overview',
        title: 'Vista Comparativa',
        content: 'Esta sección te permite comparar la proporción de respuestas ≥4 (escala 1-5) entre diferentes universidades.',
        target: '.text-2xl.sm\\:text-3xl',
        position: 'bottom'
      },
      {
        id: 'power-chart',
        title: 'Gráfico de Poder Comparativo',
        content: 'Visualiza las diferencias en los niveles de estrés entre universidades de forma clara y comparativa.',
        target: '.space-y-8',
        position: 'top'
      },
      {
        id: 'solution-impact',
        title: 'Impacto de Soluciones',
        content: 'Aquí puedes ver cómo diferentes intervenciones podrían afectar los niveles de estrés.',
        target: '.space-y-8',
        position: 'top'
      },
      {
        id: 'executive-summary',
        title: 'Resumen Ejecutivo',
        content: 'Obtén recomendaciones estratégicas basadas en el análisis comparativo para la toma de decisiones.',
        target: '.space-y-8',
        position: 'top'
      }
    ]
  },
  '/factores': {
    title: 'Factores Clave',
    icon: '🎯',
    description: 'Explora los factores que más impactan el bienestar estudiantil',
    steps: [
      {
        id: 'factors-overview',
        title: 'Factores de Estrés',
        content: 'Esta sección muestra los factores clave que afectan el bienestar estudiantil, comparados por grupo de universidad.',
        target: '.text-2xl.sm\\:text-3xl',
        position: 'bottom'
      },
      {
        id: 'likert-chart',
        title: 'Promedio Likert (1-5)',
        content: 'El gráfico izquierdo muestra el promedio de respuestas en escala Likert para cada factor de estrés.',
        target: '.grid.grid-cols-1.lg\\:grid-cols-2',
        position: 'right'
      },
      {
        id: 'percentage-chart',
        title: '% de Respuestas ≥ 4',
        content: 'El gráfico derecho muestra qué porcentaje de estudiantes reporta niveles altos de estrés (≥4) para cada factor.',
        target: '.grid.grid-cols-1.lg\\:grid-cols-2',
        position: 'left'
      },
      {
        id: 'interpretation',
        title: 'Cómo Interpretar',
        content: 'Factores con valores altos en ambos gráficos requieren atención prioritaria. Compara entre universidades para identificar patrones.',
        target: '.grid.grid-cols-1.lg\\:grid-cols-2',
        position: 'top'
      }
    ]
  },
  '/simulaciones': {
    title: 'Simulaciones What-If',
    icon: '🔮',
    description: 'Simula el impacto de diferentes inversiones en programas de bienestar',
    steps: [
      {
        id: 'simulation-overview',
        title: 'Simulaciones What-If',
        content: 'Esta herramienta te permite simular el impacto de diferentes inversiones en programas de bienestar estudiantil.',
        target: '.text-2xl.sm\\:text-3xl',
        position: 'bottom'
      },
      {
        id: 'university-filter',
        title: 'Filtro por Universidad',
        content: 'Selecciona si quieres simular para todas las universidades, solo Universidad de Caldas, o solo otras universidades.',
        target: '.bg-white.rounded-xl.shadow-sm.border.border-gray-100.p-4',
        position: 'bottom'
      },
      {
        id: 'intervention-sliders',
        title: 'Controles de Intervención',
        content: 'Ajusta estos sliders para simular diferentes niveles de inversión en: tutoría académica, salud mental, y apoyo financiero.',
        target: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3',
        position: 'top'
      },
      {
        id: 'effectiveness-slider',
        title: 'Efectividad del Modelo',
        content: 'Este control ajusta qué tan efectivo es el modelo en general (0% = no efectivo, 100% = muy efectivo).',
        target: '.bg-white.rounded-xl.shadow-sm.border.border-gray-100.p-4.sm\\:p-6.mb-6',
        position: 'top'
      },
      {
        id: 'results-display',
        title: 'Resultados de la Simulación',
        content: 'Aquí verás el índice %≥4 antes (baseline) y después (escenario) de aplicar las intervenciones. El delta muestra el cambio.',
        target: '.grid.grid-cols-1.sm\\:grid-cols-2.gap-4',
        position: 'top'
      }
    ]
  },
  '/reportes': {
    title: 'Carga de Datos & Reportes',
    icon: '📁',
    description: 'Gestiona la carga de datasets y herramientas de administración',
    steps: [
      {
        id: 'reports-overview',
        title: 'Gestión de Datos',
        content: 'Esta sección te permite cargar nuevos datasets CSV y administrar la base de datos del sistema.',
        target: '.text-2xl.sm\\:text-3xl',
        position: 'bottom'
      },
      {
        id: 'csv-upload',
        title: 'Carga de Archivos CSV',
        content: 'Sube archivos CSV con datos de encuestas. El sistema acepta formatos como Stress_Dataset.csv, StressLevelDataset.csv, o Encuestas_UCaldas.csv.',
        target: '.grid.grid-cols-1.lg\\:grid-cols-2',
        position: 'right'
      },
      {
        id: 'admin-tools',
        title: 'Herramientas de Administración',
        content: 'Ver estructura de tabla: muestra las columnas de la base de datos. Limpiar BD: elimina todos los datos (¡usar con cuidado!).',
        target: '.grid.grid-cols-1.lg\\:grid-cols-2',
        position: 'left'
      },
      {
        id: 'upload-results',
        title: 'Resultados de Carga',
        content: 'Después de subir un archivo, aquí verás el resultado: cuántos registros se procesaron y si se aplicó normalización automática.',
        target: '.bg-white.rounded-xl.shadow-sm.border.border-gray-100.p-4.sm\\:p-6',
        position: 'top'
      }
    ]
  }
};

export default function InteractiveManual({ isOpen, onClose, onStartTour }) {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [overlay, setOverlay] = useState(null);

  const currentSection = MANUAL_SECTIONS[location.pathname] || MANUAL_SECTIONS['/'];

  useEffect(() => {
    if (isTourActive) {
      startTour();
    }
  }, [isTourActive]);

  const startTour = () => {
    if (currentSection.steps.length === 0) return;
    
    setTourStep(0);
    showStep(0);
  };

  const showStep = (stepIndex) => {
    const step = currentSection.steps[stepIndex];
    if (!step) return;

    // Crear overlay
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const overlay = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        position: step.position
      };
      setOverlay(overlay);
    }

    // Scroll al elemento
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const nextStep = () => {
    if (tourStep < currentSection.steps.length - 1) {
      const nextStepIndex = tourStep + 1;
      setTourStep(nextStepIndex);
      showStep(nextStepIndex);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const prevStepIndex = tourStep - 1;
      setTourStep(prevStepIndex);
      showStep(prevStepIndex);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
    setOverlay(null);
    onClose();
  };

  const skipTour = () => {
    endTour();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para resaltar elementos */}
      {isTourActive && overlay && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${overlay.left + overlay.width/2}px ${overlay.top + overlay.height/2}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)`
          }}
        />
      )}

      {/* Modal del manual */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentSection.icon}</span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Manual de Usuario - {currentSection.title}
                    </h3>
                    <p className="text-sm text-gray-500">{currentSection.description}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!isTourActive ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">¿Cómo usar esta sección?</h4>
                        <p className="text-sm text-blue-700">
                          Esta sección tiene {currentSection.steps.length} pasos que te guiarán a través de todas las funcionalidades. 
                          Puedes leer la guía paso a paso o hacer un tour interactivo.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentSection.steps.map((step, index) => (
                      <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">{step.title}</h5>
                            <p className="text-sm text-gray-600">{step.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsTourActive(true);
                        onStartTour?.();
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🚀 Iniciar Tour Interactivo
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-800">
                        Paso {tourStep + 1} de {currentSection.steps.length}
                      </h4>
                      <span className="text-sm text-blue-600">
                        {Math.round(((tourStep + 1) / currentSection.steps.length) * 100)}% completado
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((tourStep + 1) / currentSection.steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">
                      {currentSection.steps[tourStep].title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {currentSection.steps[tourStep].content}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      disabled={tourStep === 0}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Anterior
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {tourStep === currentSection.steps.length - 1 ? 'Finalizar' : 'Siguiente →'}
                    </button>
                    <button
                      onClick={skipTour}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Saltar Tour
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
