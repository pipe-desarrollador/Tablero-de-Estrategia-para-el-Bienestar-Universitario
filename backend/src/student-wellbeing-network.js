/**
 * Red Bayesiana Específica para Bienestar Estudiantil
 * Configuración y inicialización de la red para el sistema de bienestar universitario
 * Versión simplificada para evitar problemas de memoria
 */

const BayesianNetwork = require('./bayesian-network.js');

class StudentWellbeingNetwork extends BayesianNetwork {
  constructor() {
    super();
    this.initializeNetwork();
  }

  /**
   * Inicializar la red bayesiana con nodos y relaciones específicas del bienestar estudiantil
   * Versión simplificada para evitar problemas de memoria
   */
  initializeNetwork() {
    // 1. Nodos de intervenciones (variables de control)
    this.addNode('tutoria_academica', ['0%', '25%', '50%', '75%', '100%'], []);
    this.addNode('salud_mental', ['0%', '25%', '50%', '75%', '100%'], []);
    this.addNode('apoyo_financiero', ['0%', '25%', '50%', '75%', '100%'], []);

    // 2. Nodos de factores de estrés (variables objetivo) - Red simplificada
    this.addNode('academic_overload', ['baja', 'media', 'alta'], ['tutoria_academica']);
    this.addNode('concentration_issues', ['baja', 'media', 'alta'], ['tutoria_academica']);
    this.addNode('sleep_problems', ['baja', 'media', 'alta'], ['salud_mental']);
    this.addNode('anxiety', ['baja', 'media', 'alta'], ['salud_mental']);
    this.addNode('sadness', ['baja', 'media', 'alta'], ['salud_mental']);
    this.addNode('headaches', ['baja', 'media', 'alta'], ['apoyo_financiero']);
    this.addNode('palpitations', ['baja', 'media', 'alta'], ['apoyo_financiero']);
    this.addNode('irritability', ['baja', 'media', 'alta'], ['apoyo_financiero']);

    // 3. Nodo de bienestar general (variable de resultado)
    this.addNode('wellbeing_index', ['bajo', 'medio', 'alto'], [
      'anxiety', 'sleep_problems', 'concentration_issues'
    ]);

    // Configurar tablas de probabilidades condicionales
    this.setupCPTs();
  }

  /**
   * Configurar tablas de probabilidades condicionales basadas en conocimiento experto
   * Versión simplificada para evitar problemas de memoria
   */
  setupCPTs() {
    // CPT para sobrecarga académica
    this.setCPT('academic_overload', {
      '0%': { baja: 0.1, media: 0.3, alta: 0.6 },
      '25%': { baja: 0.2, media: 0.4, alta: 0.4 },
      '50%': { baja: 0.3, media: 0.5, alta: 0.2 },
      '75%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '100%': { baja: 0.5, media: 0.3, alta: 0.2 }
    });

    // CPT para problemas de concentración (simplificado)
    this.setCPT('concentration_issues', {
      '0%': { baja: 0.1, media: 0.3, alta: 0.6 },
      '25%': { baja: 0.2, media: 0.4, alta: 0.4 },
      '50%': { baja: 0.3, media: 0.5, alta: 0.2 },
      '75%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '100%': { baja: 0.5, media: 0.3, alta: 0.2 }
    });

    // CPT para problemas de sueño (simplificado)
    this.setCPT('sleep_problems', {
      '0%': { baja: 0.2, media: 0.4, alta: 0.4 },
      '25%': { baja: 0.3, media: 0.4, alta: 0.3 },
      '50%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '75%': { baja: 0.5, media: 0.3, alta: 0.2 },
      '100%': { baja: 0.6, media: 0.3, alta: 0.1 }
    });

    // CPT para ansiedad (simplificado)
    this.setCPT('anxiety', {
      '0%': { baja: 0.2, media: 0.4, alta: 0.4 },
      '25%': { baja: 0.3, media: 0.4, alta: 0.3 },
      '50%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '75%': { baja: 0.5, media: 0.3, alta: 0.2 },
      '100%': { baja: 0.6, media: 0.3, alta: 0.1 }
    });

    // CPT para tristeza (simplificado)
    this.setCPT('sadness', {
      '0%': { baja: 0.3, media: 0.4, alta: 0.3 },
      '25%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '50%': { baja: 0.5, media: 0.3, alta: 0.2 },
      '75%': { baja: 0.6, media: 0.3, alta: 0.1 },
      '100%': { baja: 0.7, media: 0.2, alta: 0.1 }
    });

    // CPT para dolores de cabeza (simplificado)
    this.setCPT('headaches', {
      '0%': { baja: 0.3, media: 0.4, alta: 0.3 },
      '25%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '50%': { baja: 0.5, media: 0.3, alta: 0.2 },
      '75%': { baja: 0.6, media: 0.3, alta: 0.1 },
      '100%': { baja: 0.7, media: 0.2, alta: 0.1 }
    });

    // CPT para palpitaciones (simplificado)
    this.setCPT('palpitations', {
      '0%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '25%': { baja: 0.5, media: 0.3, alta: 0.2 },
      '50%': { baja: 0.6, media: 0.3, alta: 0.1 },
      '75%': { baja: 0.7, media: 0.2, alta: 0.1 },
      '100%': { baja: 0.8, media: 0.15, alta: 0.05 }
    });

    // CPT para irritabilidad (simplificado)
    this.setCPT('irritability', {
      '0%': { baja: 0.3, media: 0.4, alta: 0.3 },
      '25%': { baja: 0.4, media: 0.4, alta: 0.2 },
      '50%': { baja: 0.5, media: 0.3, alta: 0.2 },
      '75%': { baja: 0.6, media: 0.3, alta: 0.1 },
      '100%': { baja: 0.7, media: 0.2, alta: 0.1 }
    });

    // CPT para índice de bienestar general (simplificado)
    this.setCPT('wellbeing_index', {
      'baja,baja,baja': { bajo: 0.1, medio: 0.3, alto: 0.6 },
      'baja,baja,media': { bajo: 0.2, medio: 0.4, alto: 0.4 },
      'baja,baja,alta': { bajo: 0.3, medio: 0.4, alto: 0.3 },
      'baja,media,baja': { bajo: 0.2, medio: 0.4, alto: 0.4 },
      'baja,media,media': { bajo: 0.3, medio: 0.4, alto: 0.3 },
      'baja,media,alta': { bajo: 0.4, medio: 0.4, alto: 0.2 },
      'baja,alta,baja': { bajo: 0.3, medio: 0.4, alto: 0.3 },
      'baja,alta,media': { bajo: 0.4, medio: 0.4, alto: 0.2 },
      'baja,alta,alta': { bajo: 0.5, medio: 0.3, alto: 0.2 },
      'media,baja,baja': { bajo: 0.3, medio: 0.4, alto: 0.3 },
      'media,baja,media': { bajo: 0.4, medio: 0.4, alto: 0.2 },
      'media,baja,alta': { bajo: 0.5, medio: 0.3, alto: 0.2 },
      'media,media,baja': { bajo: 0.4, medio: 0.4, alto: 0.2 },
      'media,media,media': { bajo: 0.5, medio: 0.3, alto: 0.2 },
      'media,media,alta': { bajo: 0.6, medio: 0.3, alto: 0.1 },
      'media,alta,baja': { bajo: 0.5, medio: 0.3, alto: 0.2 },
      'media,alta,media': { bajo: 0.6, medio: 0.3, alto: 0.1 },
      'media,alta,alta': { bajo: 0.7, medio: 0.2, alto: 0.1 },
      'alta,baja,baja': { bajo: 0.5, medio: 0.3, alto: 0.2 },
      'alta,baja,media': { bajo: 0.6, medio: 0.3, alto: 0.1 },
      'alta,baja,alta': { bajo: 0.7, medio: 0.2, alto: 0.1 },
      'alta,media,baja': { bajo: 0.6, medio: 0.3, alto: 0.1 },
      'alta,media,media': { bajo: 0.7, medio: 0.2, alto: 0.1 },
      'alta,media,alta': { bajo: 0.8, medio: 0.15, alto: 0.05 },
      'alta,alta,baja': { bajo: 0.7, medio: 0.2, alto: 0.1 },
      'alta,alta,media': { bajo: 0.8, medio: 0.15, alto: 0.05 },
      'alta,alta,alta': { bajo: 0.9, medio: 0.08, alto: 0.02 }
    });
  }

  /**
   * Simular intervención específica
   * @param {Object} interventions - Objeto con intervenciones
   * @param {string} target - Variable objetivo
   * @returns {Object} Resultado de la simulación
   */
  simulateIntervention(interventions, target) {
    // Limpiar evidencia previa
    this.clearEvidence();
    
    // Establecer evidencia de intervenciones
    for (const [intervention, value] of Object.entries(interventions)) {
      this.setEvidence(intervention, value);
    }
    
    // Inferir probabilidades resultantes
    return this.infer(target);
  }

  /**
   * Calcular impacto de múltiples intervenciones
   * @param {Object} interventions - Intervenciones a simular
   * @returns {Object} Impacto en todas las variables objetivo
   */
  calculateInterventionImpact(interventions) {
    const targets = [
      'academic_overload', 'concentration_issues', 'sleep_problems',
      'anxiety', 'sadness', 'headaches', 'palpitations', 'irritability',
      'wellbeing_index'
    ];
    
    const results = {};
    
    for (const target of targets) {
      results[target] = this.simulateIntervention(interventions, target);
    }
    
    return results;
  }

  /**
   * Obtener explicación de una simulación
   * @param {Object} interventions - Intervenciones aplicadas
   * @param {string} target - Variable objetivo
   * @returns {string} Explicación textual
   */
  getSimulationExplanation(interventions, target) {
    const baseline = this.infer(target);
    const postIntervention = this.simulateIntervention(interventions, target);
    
    const baselineValue = this.calculateExpectedValue(baseline);
    const postValue = this.calculateExpectedValue(postIntervention);
    const improvement = baselineValue - postValue;
    const improvementPercent = baselineValue > 0 ? (improvement / baselineValue) * 100 : 0;
    
    let explanation = `Análisis de Impacto para ${target}:\n\n`;
    explanation += 'Intervenciones aplicadas:\n';
    for (const [intervention, value] of Object.entries(interventions)) {
      explanation += `- ${intervention}: ${value}\n`;
    }
    explanation += '\nResultado:\n';
    explanation += `- Estado actual: ${baselineValue.toFixed(2)}\n`;
    explanation += `- Estado post-intervención: ${postValue.toFixed(2)}\n`;
    explanation += `- Mejora: ${improvement.toFixed(2)} (${improvementPercent.toFixed(1)}%)\n\n`;
    explanation += 'Distribución de probabilidades:\n';
    explanation += `- Baja: ${(postIntervention.baja * 100).toFixed(1)}%\n`;
    explanation += `- Media: ${(postIntervention.media * 100).toFixed(1)}%\n`;
    explanation += `- Alta: ${(postIntervention.alta * 100).toFixed(1)}%\n`;
    
    return explanation;
  }
}

module.exports = StudentWellbeingNetwork;