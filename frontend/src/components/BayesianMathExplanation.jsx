import React, { useState, useEffect } from 'react';
import { getBayesianStats } from '../lib/api.js';

const BayesianMathExplanation = ({ 
  baseline = null, 
  postIntervention = null, 
  target = 'wellbeing_index',
  interventions = {} 
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [realData, setRealData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // Cargar datos reales al montar el componente
  useEffect(() => {
    const loadRealData = async () => {
      setLoadingData(true);
      setDataError('');
      try {
        const response = await getBayesianStats();
        if (response.status === 'success') {
          // Validar que los datos sean apropiados para el análisis bayesiano
          const stats = response.stats;
          const isValidForBayesian = 
            stats.probabilities.P_A > 0.1 && stats.probabilities.P_A < 0.9 && // Entre 10% y 90%
            stats.probabilities.P_B > 0.1 && stats.probabilities.P_B < 0.9 && // Entre 10% y 90%
            stats.probabilities.P_B_given_A > 0.1 && stats.probabilities.P_B_given_A < 0.9; // Entre 10% y 90%
          
          if (isValidForBayesian) {
            setRealData(stats);
          } else {
            setDataError('(usando datos simulados para demostración y prueba de concepto)');
            setRealData(null);
          }
        } else {
          setDataError('Error al cargar datos reales');
        }
      } catch (error) {
        setDataError('Error de conexión al cargar datos');
        console.error('Error cargando estadísticas bayesianas:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadRealData();
  }, []);

  // Datos de ejemplo para la explicación (fallback)
  const exampleData = {
    P_A: 0.35, // 35% de estudiantes tienen alto bienestar
    P_B: 0.45, // 45% tienen buena tutoría
    P_B_given_A: 0.65, // 65% de estudiantes con alto bienestar tienen buena tutoría
    P_A_given_B: 0.51 // 51% de estudiantes con buena tutoría tienen alto bienestar
  };

  // Usar datos reales si están disponibles, sino usar datos de ejemplo
  const currentData = realData ? realData.probabilities : exampleData;
  const totalStudents = realData ? realData.total_students : 1000;
  const highWellbeingCount = realData ? realData.high_wellbeing : Math.round(1000 * exampleData.P_A);
  const goodTutoringCount = realData ? realData.good_tutoring : Math.round(1000 * exampleData.P_B);
  const highWellbeingWithGoodTutoringCount = realData ? realData.high_wellbeing_with_good_tutoring : Math.round(highWellbeingCount * exampleData.P_B_given_A);

  const steps = [
    {
      title: "🎯 ¿Qué queremos saber?",
      content: "Queremos calcular la probabilidad de que un estudiante tenga ALTO BIENESTAR (pocos síntomas de estrés), sabiendo que tiene BUENA TUTORÍA ACADÉMICA (sin dificultades con profesores).",
      formula: "P(Alto Bienestar | Buena Tutoría) = ?",
      explanation: "Esto nos ayuda a entender si tener buenas relaciones con profesores realmente mejora el bienestar estudiantil."
    },
    {
      title: "📊 Datos que conocemos",
      content: realData ? 
        `Basándonos en los datos reales de ${totalStudents.toLocaleString()} estudiantes de la universidad:` :
        `Basándonos en datos simulados representativos (${totalStudents.toLocaleString()} estudiantes):`,
      data: [
        { 
          label: "Estudiantes con alto bienestar (≤2 síntomas de estrés)", 
          value: `${(currentData.P_A * 100).toFixed(1)}%`, 
          count: `${highWellbeingCount.toLocaleString()} estudiantes`,
          color: "bg-green-100 text-green-800" 
        },
        { 
          label: "Estudiantes con buena tutoría (sin dificultades con profesores)", 
          value: `${(currentData.P_B * 100).toFixed(1)}%`, 
          count: `${goodTutoringCount.toLocaleString()} estudiantes`,
          color: "bg-blue-100 text-blue-800" 
        },
        { 
          label: "De los que tienen alto bienestar, cuántos tienen buena tutoría", 
          value: `${(currentData.P_B_given_A * 100).toFixed(1)}%`, 
          count: `${highWellbeingWithGoodTutoringCount.toLocaleString()} estudiantes`,
          color: "bg-purple-100 text-purple-800" 
        }
      ]
    },
    {
      title: "🧮 Aplicando la Fórmula de Bayes",
      content: "Usamos la fórmula: P(A|B) = P(B|A) × P(A) / P(B)",
      formula: `P(Alto Bienestar | Buena Tutoría) = (${currentData.P_B_given_A.toFixed(3)} × ${currentData.P_A.toFixed(3)}) / ${currentData.P_B.toFixed(3)}`,
      calculation: `= ${(currentData.P_B_given_A * currentData.P_A).toFixed(3)} / ${currentData.P_B.toFixed(3)} = ${currentData.P_A_given_B.toFixed(3)} = ${(currentData.P_A_given_B * 100).toFixed(1)}%`,
      explanation: `Esto significa que si un estudiante tiene buena tutoría, hay un ${(currentData.P_A_given_B * 100).toFixed(1)}% de probabilidad de que tenga alto bienestar.`
    },
    {
      title: "🎯 Interpretación Práctica",
      content: "¿Qué significa este resultado?",
      insights: [
        `Sin información sobre relaciones con profesores, solo ${(currentData.P_A * 100).toFixed(1)}% de estudiantes tienen alto bienestar`,
        `Con buenas relaciones con profesores, la probabilidad sube a ${(currentData.P_A_given_B * 100).toFixed(1)}%`,
        `Esto representa una mejora del ${(((currentData.P_A_given_B - currentData.P_A) / currentData.P_A) * 100).toFixed(0)}% en las probabilidades`,
        "Las buenas relaciones con profesores SÍ tienen un impacto positivo significativo en el bienestar estudiantil"
      ]
    }
  ];

  const getCurrentStepData = () => {
    if (currentStep < steps.length) {
      return steps[currentStep];
    }
    return null;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetExplanation = () => {
    setCurrentStep(0);
    setShowExplanation(false);
  };

  if (!showExplanation) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🧠 ¿Cómo funciona la simulación bayesiana?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Entiende la matemática detrás de las predicciones de manera simple y visual
            </p>
          </div>
          <button
            onClick={() => setShowExplanation(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Ver Explicación
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = getCurrentStepData();

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            🧮 Explicación Matemática: Teorema de Bayes
          </h3>
          {loadingData && (
            <p className="text-sm text-blue-600 mt-1">📊 Cargando datos reales...</p>
          )}
          {dataError && (
            <p className="text-sm text-orange-600 mt-1">⚠️ {dataError}</p>
          )}
          {realData && !loadingData && (
            <p className="text-sm text-green-600 mt-1">✅ Datos reales de {totalStudents.toLocaleString()} estudiantes</p>
          )}
          {!realData && !loadingData && !dataError && (
            <p className="text-sm text-blue-600 mt-1">📊 Usando datos simulados para demostración</p>
          )}
        </div>
        <button
          onClick={resetExplanation}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ✕ Cerrar
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Paso {currentStep + 1} de {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step Content */}
      {currentStepData && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {currentStepData.title}
          </h4>
          
          <p className="text-gray-700 mb-4">
            {currentStepData.content}
          </p>

          {/* Formula Display */}
          {currentStepData.formula && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-mono text-gray-800 mb-2">
                  {currentStepData.formula}
                </div>
                {currentStepData.calculation && (
                  <div className="text-xl font-bold text-blue-600">
                    {currentStepData.calculation}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Display */}
          {currentStepData.data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {currentStepData.data.map((item, index) => (
                <div key={index} className={`rounded-lg p-3 ${item.color}`}>
                  <div className="text-sm font-medium mb-1">{item.label}</div>
                  <div className="text-xl font-bold">{item.value}</div>
                  {item.count && (
                    <div className="text-xs opacity-75 mt-1">{item.count}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          {currentStepData.insights && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h5 className="font-semibold text-green-800 mb-2">💡 Conclusiones:</h5>
              <ul className="space-y-1">
                {currentStepData.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start">
                    <span className="mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explanation */}
          {currentStepData.explanation && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-sm text-blue-800">
                <strong>💭 En palabras simples:</strong> {currentStepData.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStep === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          ← Anterior
        </button>

        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep
                  ? 'bg-blue-600'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStep === steps.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentStep === steps.length - 1 ? '¡Completado!' : 'Siguiente →'}
        </button>
      </div>

      {/* Final Step - Real Data Integration */}
      {currentStep === steps.length - 1 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h5 className="font-semibold text-gray-900 mb-2">🎯 Aplicación en tu Simulación</h5>
          <p className="text-sm text-gray-700">
            Esta misma lógica matemática se aplica automáticamente cuando ejecutas las simulaciones bayesianas. 
            El sistema calcula estas probabilidades en tiempo real basándose en los datos reales de tu universidad.
          </p>
        </div>
      )}
    </div>
  );
};

export default BayesianMathExplanation;
