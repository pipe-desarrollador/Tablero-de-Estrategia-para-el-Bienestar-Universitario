// /src/components/StressSolutions.jsx
// Descripción: Componente que muestra soluciones dinámicas basadas en factores de estrés críticos
import { useState } from 'react';

// Base de conocimiento de soluciones por factor de estrés
const STRESS_SOLUTIONS = {
  'sleep_problems': {
    name: 'Problemas de Sueño',
    icon: '🌙',
    solutions: [
      {
        title: 'Programa de Higiene del Sueño',
        description: 'Talleres y recursos para mejorar hábitos de sueño',
        impact: 'Alto',
        cost: 'Bajo',
        timeframe: '3-6 meses',
        actions: [
          'Talleres semanales sobre higiene del sueño',
          'App móvil con recordatorios de sueño',
          'Espacios de descanso en bibliotecas',
          'Política de horarios de clases más flexibles'
        ]
      },
      {
        title: 'Servicios de Salud Mental',
        description: 'Ampliar servicios de consejería y terapia',
        impact: 'Muy Alto',
        cost: 'Medio',
        timeframe: '6-12 meses',
        actions: [
          'Contratar más psicólogos especializados',
          'Terapia cognitivo-conductual para insomnio',
          'Grupos de apoyo para estudiantes',
          'Línea de crisis 24/7'
        ]
      }
    ]
  },
  'headaches': {
    name: 'Dolores de Cabeza',
    icon: '🤕',
    solutions: [
      {
        title: 'Programa de Manejo del Estrés',
        description: 'Técnicas de relajación y manejo del estrés',
        impact: 'Alto',
        cost: 'Bajo',
        timeframe: '2-4 meses',
        actions: [
          'Clases de yoga y meditación',
          'Talleres de respiración y relajación',
          'Espacios de descompresión en campus',
          'Técnicas de mindfulness'
        ]
      },
      {
        title: 'Mejora del Ambiente Físico',
        description: 'Optimización de espacios de estudio y trabajo',
        impact: 'Medio',
        cost: 'Medio',
        timeframe: '4-8 meses',
        actions: [
          'Mejorar iluminación en aulas',
          'Actualizar mobiliario ergonómico',
          'Control de ruido en bibliotecas',
          'Espacios de descanso con masajes'
        ]
      }
    ]
  },
  'concentration_issues': {
    name: 'Problemas de Concentración',
    icon: '🎯',
    solutions: [
      {
        title: 'Programa de Tutoría Académica',
        description: 'Apoyo personalizado para mejorar rendimiento académico',
        impact: 'Muy Alto',
        cost: 'Medio',
        timeframe: '3-6 meses',
        actions: [
          'Tutores especializados por materia',
          'Técnicas de estudio personalizadas',
          'Grupos de estudio supervisados',
          'Evaluación de estilos de aprendizaje'
        ]
      },
      {
        title: 'Centro de Desarrollo de Habilidades',
        description: 'Desarrollo de habilidades cognitivas y de estudio',
        impact: 'Alto',
        cost: 'Bajo',
        timeframe: '2-4 meses',
        actions: [
          'Talleres de técnicas de memoria',
          'Entrenamiento en atención plena',
          'Herramientas digitales de organización',
          'Coaching académico individual'
        ]
      }
    ]
  },
  'irritability': {
    name: 'Irritabilidad',
    icon: '😤',
    solutions: [
      {
        title: 'Programa de Manejo Emocional',
        description: 'Desarrollo de inteligencia emocional y manejo de conflictos',
        impact: 'Alto',
        cost: 'Bajo',
        timeframe: '2-4 meses',
        actions: [
          'Talleres de inteligencia emocional',
          'Técnicas de comunicación asertiva',
          'Manejo de conflictos interpersonales',
          'Programas de mediación estudiantil'
        ]
      },
      {
        title: 'Ambiente de Apoyo Social',
        description: 'Fortalecimiento de redes de apoyo estudiantil',
        impact: 'Medio',
        cost: 'Bajo',
        timeframe: '1-3 meses',
        actions: [
          'Programas de mentores estudiantiles',
          'Grupos de interés y hobbies',
          'Eventos de integración social',
          'Espacios de conversación y apoyo'
        ]
      }
    ]
  },
  'palpitations': {
    name: 'Palpitaciones',
    icon: '💓',
    solutions: [
      {
        title: 'Programa de Salud Cardiovascular',
        description: 'Promoción de hábitos saludables y manejo de ansiedad',
        impact: 'Alto',
        cost: 'Medio',
        timeframe: '4-8 meses',
        actions: [
          'Evaluaciones médicas regulares',
          'Programas de ejercicio supervisado',
          'Talleres de manejo de ansiedad',
          'Técnicas de respiración y relajación'
        ]
      },
      {
        title: 'Servicios de Salud Preventiva',
        description: 'Detección temprana y prevención de problemas de salud',
        impact: 'Muy Alto',
        cost: 'Alto',
        timeframe: '6-12 meses',
        actions: [
          'Clínica de salud estudiantil ampliada',
          'Chequeos médicos gratuitos',
          'Programas de nutrición saludable',
          'Monitoreo de signos vitales'
        ]
      }
    ]
  },
  'sadness': {
    name: 'Tristeza',
    icon: '😢',
    solutions: [
      {
        title: 'Programa de Apoyo Emocional',
        description: 'Servicios especializados en salud mental y bienestar emocional',
        impact: 'Muy Alto',
        cost: 'Alto',
        timeframe: '6-12 meses',
        actions: [
          'Psicólogos especializados en depresión',
          'Terapia grupal e individual',
          'Programas de prevención del suicidio',
          'Red de apoyo entre pares'
        ]
      },
      {
        title: 'Iniciativas de Bienestar Integral',
        description: 'Enfoque holístico del bienestar estudiantil',
        impact: 'Alto',
        cost: 'Medio',
        timeframe: '3-6 meses',
        actions: [
          'Actividades recreativas y deportivas',
          'Programas de arte y creatividad',
          'Terapia con mascotas',
          'Espacios de naturaleza y jardines'
        ]
      }
    ]
  },
  'anxiety': {
    name: 'Ansiedad',
    icon: '😰',
    solutions: [
      {
        title: 'Programa de Manejo de Ansiedad',
        description: 'Técnicas especializadas para el manejo de la ansiedad',
        impact: 'Muy Alto',
        cost: 'Medio',
        timeframe: '3-6 meses',
        actions: [
          'Terapia cognitivo-conductual para ansiedad',
          'Técnicas de exposición gradual',
          'Talleres de manejo de pánico',
          'Grupos de apoyo para ansiedad'
        ]
      },
      {
        title: 'Ambiente Académico Menos Estresante',
        description: 'Reformas en la estructura académica para reducir presión',
        impact: 'Alto',
        cost: 'Bajo',
        timeframe: '2-4 meses',
        actions: [
          'Políticas de evaluación más flexibles',
          'Períodos de gracia para entregas',
          'Opciones de cursos menos intensivos',
          'Sistema de alertas tempranas'
        ]
      }
    ]
  }
};

export default function StressSolutions({ data = [], universityGroup = '' }) {
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);

  // Mapeo de nombres de factores del backend a las claves de soluciones
  const factorMapping = {
    'Sueño': 'sleep_problems',
    'Dolor cabeza': 'headaches', 
    'Concentración': 'concentration_issues',
    'Irritabilidad': 'irritability',
    'Palpitaciones': 'palpitations',
    'Tristeza': 'sadness',
    'Ansiedad': 'anxiety',
    'sleep_problems': 'sleep_problems',
    'headaches': 'headaches',
    'concentration_issues': 'concentration_issues',
    'irritability': 'irritability',
    'palpitations': 'palpitations',
    'sadness': 'sadness',
    'anxiety': 'anxiety'
  };

  // Encontrar el factor más crítico
  const getCriticalFactor = () => {
    if (!data || data.length === 0) return null;
    
    let maxValue = 0;
    let criticalFactor = null;
    
    data.forEach(series => {
      if (series.data) {
        series.data.forEach(item => {
          if (item.y > maxValue) {
            maxValue = item.y;
            criticalFactor = item.x;
          }
        });
      }
    });
    
    // Mapear el nombre del factor a la clave de solución
    return factorMapping[criticalFactor] || criticalFactor;
  };

  const criticalFactor = getCriticalFactor();
  const factorData = criticalFactor ? STRESS_SOLUTIONS[criticalFactor] : null;

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Muy Alto': return 'text-green-600 bg-green-50';
      case 'Alto': return 'text-blue-600 bg-blue-50';
      case 'Medio': return 'text-yellow-600 bg-yellow-50';
      case 'Bajo': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCostColor = (cost) => {
    switch (cost) {
      case 'Bajo': return 'text-green-600 bg-green-50';
      case 'Medio': return 'text-yellow-600 bg-yellow-50';
      case 'Alto': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!factorData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p>No hay datos suficientes para generar recomendaciones</p>
          <p className="text-sm text-gray-400 mt-2">
            Cargue datos en la sección de Reportes para ver las soluciones recomendadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{factorData.icon}</span>
          <h3 className="text-xl font-bold text-gray-800">
            Factor Crítico: {factorData.name}
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Basado en el análisis de {universityGroup || 'las universidades'}, este es el factor de estrés más impactante.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {factorData.solutions.map((solution, index) => (
          <div 
            key={index}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedSolution === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedSolution(selectedSolution === index ? null : index)}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-gray-800 text-lg">{solution.title}</h4>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(solution.impact)}`}>
                  Impacto: {solution.impact}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(solution.cost)}`}>
                  Costo: {solution.cost}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {solution.timeframe}
              </span>
            </div>

            {selectedSolution === index && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Acciones Específicas:</h5>
                <ul className="space-y-1">
                  {solution.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h5 className="font-medium text-blue-800">Recomendación Estratégica</h5>
            <p className="text-sm text-blue-700 mt-1">
              Para {universityGroup || 'su universidad'}, recomendamos priorizar las soluciones de <strong>mayor impacto</strong> 
              y <strong>menor costo</strong> para maximizar el retorno de la inversión en bienestar estudiantil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
