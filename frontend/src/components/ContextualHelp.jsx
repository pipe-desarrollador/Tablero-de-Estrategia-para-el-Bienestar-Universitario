// /src/components/ContextualHelp.jsx
// Descripción: Sistema de ayuda contextual que aparece en elementos específicos
import { useState, useEffect } from 'react';

const HELP_TOOLTIPS = {
  'kpi-card': {
    title: '¿Qué son los KPIs?',
    content: 'Los KPIs (Indicadores Clave de Rendimiento) muestran métricas importantes del bienestar estudiantil. El promedio de estrés te da una visión general, mientras que los factores críticos te indican qué áreas necesitan atención inmediata.'
  },
  'trend-chart': {
    title: 'Interpretando las Tendencias',
    content: 'Este gráfico muestra cómo evolucionan los niveles de estrés a lo largo del tiempo. Una línea ascendente indica aumento del estrés, mientras que una descendente muestra mejoras. Usa esta información para evaluar la efectividad de los programas implementados.'
  },
  'comparative-chart': {
    title: 'Análisis Comparativo',
    content: 'Este gráfico compara la proporción de estudiantes con niveles altos de estrés (≥4 en escala 1-5) entre diferentes universidades. Las barras más altas indican mayor prevalencia de estrés en esa universidad.'
  },
  'factor-chart': {
    title: 'Factores de Estrés',
    content: 'Estos gráficos muestran qué factores causan más estrés. El gráfico izquierdo (promedio Likert) muestra la intensidad promedio, mientras que el derecho (%≥4) muestra qué porcentaje de estudiantes reporta niveles altos de estrés.'
  },
  'simulation-slider': {
    title: 'Simulaciones What-If',
    content: 'Ajusta estos controles para simular diferentes niveles de inversión en programas de bienestar. El sistema calculará automáticamente el impacto esperado en los niveles de estrés estudiantil.'
  },
  'upload-csv': {
    title: 'Carga de Datos CSV',
    content: 'Sube archivos CSV con datos de encuestas de estrés. El sistema acepta diferentes formatos y normaliza automáticamente las escalas. Asegúrate de que el archivo tenga las columnas correctas según la estructura esperada.'
  },
  'baseline-scenario': {
    title: 'Baseline vs Escenario',
    content: 'Baseline: estado actual sin intervenciones. Escenario: estado proyectado después de aplicar las intervenciones simuladas. El delta (Δ) muestra el cambio esperado en puntos porcentuales.'
  }
};

export default function ContextualHelp({ 
  helpId, 
  children, 
  position = 'top',
  className = '',
  showOnHover = true 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const helpData = HELP_TOOLTIPS[helpId];
  
  useEffect(() => {
    if (showOnHover && isHovered) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isHovered, showOnHover]);

  if (!helpData) {
    return children;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Indicador de ayuda */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">?</span>
      </div>

      {/* Tooltip de ayuda */}
      {isVisible && (
        <div className={`absolute z-50 w-80 ${getPositionClasses()}`}>
          <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{helpData.title}</h4>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white ml-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              {helpData.content}
            </p>
            
            {/* Flecha del tooltip */}
            <div className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar ayuda contextual en botones
export function HelpButton({ helpId, children, ...props }) {
  return (
    <ContextualHelp helpId={helpId} {...props}>
      <button className="relative">
        {children}
      </button>
    </ContextualHelp>
  );
}

// Componente para mostrar ayuda contextual en elementos de formulario
export function HelpInput({ helpId, children, ...props }) {
  return (
    <ContextualHelp helpId={helpId} {...props}>
      <div className="relative">
        {children}
      </div>
    </ContextualHelp>
  );
}

// Componente para mostrar ayuda contextual en gráficos
export function HelpChart({ helpId, children, ...props }) {
  return (
    <ContextualHelp helpId={helpId} {...props}>
      <div className="relative">
        {children}
      </div>
    </ContextualHelp>
  );
}
