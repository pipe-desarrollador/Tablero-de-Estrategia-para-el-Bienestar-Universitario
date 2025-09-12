/**
 * Red Bayesiana para Simulación de Bienestar Estudiantil
 * Implementa inferencia bayesiana para simulaciones what-if
 */

class BayesianNetwork {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.cpts = new Map(); // Tablas de Probabilidades Condicionales
    this.evidence = new Map();
  }

  /**
   * Agregar nodo a la red
   * @param {string} name - Nombre del nodo
   * @param {Array} states - Estados posibles del nodo
   * @param {Array} parents - Nodos padre
   */
  addNode(name, states, parents = []) {
    this.nodes.set(name, { states, parents });
    this.edges.set(name, parents);
    this.cpts.set(name, new Map());
  }

  /**
   * Establecer tabla de probabilidades condicionales (CPT)
   * @param {string} node - Nombre del nodo
   * @param {Object} cpt - Tabla de probabilidades
   */
  setCPT(node, cpt) {
    this.cpts.set(node, cpt);
  }

  /**
   * Establecer evidencia (observación)
   * @param {string} node - Nombre del nodo
   * @param {string} value - Valor observado
   */
  setEvidence(node, value) {
    this.evidence.set(node, value);
  }

  /**
   * Limpiar evidencia
   */
  clearEvidence() {
    this.evidence.clear();
  }

  /**
   * Obtener padres de un nodo
   * @param {string} node - Nombre del nodo
   * @returns {Array} Lista de nodos padre
   */
  getParents(node) {
    return this.edges.get(node) || [];
  }

  /**
   * Obtener hijos de un nodo
   * @param {string} node - Nombre del nodo
   * @returns {Array} Lista de nodos hijo
   */
  getChildren(node) {
    const children = [];
    for (const [child, parents] of this.edges.entries()) {
      if (parents.includes(node)) {
        children.push(child);
      }
    }
    return children;
  }

  /**
   * Obtener CPT de un nodo
   * @param {string} node - Nombre del nodo
   * @returns {Object} Tabla de probabilidades condicionales
   */
  getCPT(node) {
    return this.cpts.get(node) || {};
  }

  /**
   * Calcular probabilidad condicional usando eliminación de variables (optimizado)
   * @param {string} query - Variable de consulta
   * @param {Object} evidence - Evidencia observada
   * @returns {Object} Probabilidades de la variable consultada
   */
  infer(query, evidence = {}) {
    // Combinar evidencia existente con nueva evidencia
    const combinedEvidence = { ...Object.fromEntries(this.evidence), ...evidence };
    
    // Obtener todas las variables
    const allVariables = Array.from(this.nodes.keys());
    
    // Variables ocultas (todas excepto query y evidence)
    const hiddenVariables = allVariables.filter(v => 
      v !== query && !(v in combinedEvidence)
    );

    // Para redes grandes, usar aproximación
    if (hiddenVariables.length > 8) {
      return this.approximateInference(query, combinedEvidence);
    }

    // Calcular probabilidad conjunta y marginalizar
    const probabilities = {};
    const queryStates = this.nodes.get(query).states;

    for (const state of queryStates) {
      let probability = 0;
      
      // Sumar sobre todas las combinaciones de variables ocultas
      const combinations = this.generateCombinations(hiddenVariables);
      
      for (const combination of combinations) {
        const fullAssignment = { ...combinedEvidence, ...combination, [query]: state };
        probability += this.calculateJointProbability(fullAssignment);
      }
      
      probabilities[state] = probability;
    }

    // Normalizar
    const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
    for (const state in probabilities) {
      probabilities[state] = total > 0 ? probabilities[state] / total : 0;
    }

    return probabilities;
  }

  /**
   * Inferencia aproximada para redes grandes
   * @param {string} query - Variable de consulta
   * @param {Object} evidence - Evidencia observada
   * @returns {Object} Probabilidades aproximadas
   */
  approximateInference(query, evidence) {
    const queryStates = this.nodes.get(query).states;
    const probabilities = {};
    
    // Inicializar con distribución uniforme
    for (const state of queryStates) {
      probabilities[state] = 1 / queryStates.length;
    }
    
    // Aplicar evidencia directa si existe
    if (evidence[query]) {
      for (const state of queryStates) {
        probabilities[state] = state === evidence[query] ? 1 : 0;
      }
      return probabilities;
    }
    
    // Aplicar efectos de padres directos
    const parents = this.getParents(query);
    if (parents.length > 0) {
      const cpt = this.getCPT(query);
      
      // Crear clave para la CPT basada en evidencia de padres
      const parentValues = parents.map(p => evidence[p] || 'default');
      const key = parentValues.join(',');
      
      if (cpt[key]) {
        return { ...cpt[key] };
      }
    }
    
    return probabilities;
  }

  /**
   * Simulación what-if (intervención)
   * @param {string} intervention - Variable intervenida
   * @param {string} value - Valor de intervención
   * @param {string} target - Variable objetivo
   * @returns {Object} Probabilidades resultantes
   */
  whatIf(intervention, value, target) {
    // Crear copia temporal de la red
    const tempNetwork = this.clone();
    
    // Eliminar arcos entrantes a la variable intervenida
    tempNetwork.removeIncomingArcs(intervention);
    
    // Establecer evidencia de intervención
    tempNetwork.setEvidence(intervention, value);
    
    // Inferir probabilidades resultantes
    return tempNetwork.infer(target);
  }

  /**
   * Calcular impacto esperado de una intervención
   * @param {string} intervention - Variable intervenida
   * @param {string} value - Valor de intervención
   * @param {string} target - Variable objetivo
   * @returns {Object} Impacto esperado
   */
  calculateExpectedImpact(intervention, value, target) {
    // Estado actual (baseline)
    const baseline = this.infer(target);
    
    // Estado post-intervención
    const postIntervention = this.whatIf(intervention, value, target);
    
    // Calcular valores esperados
    const baselineValue = this.calculateExpectedValue(baseline);
    const postValue = this.calculateExpectedValue(postIntervention);
    
    return {
      baseline: baselineValue,
      postIntervention: postValue,
      improvement: baselineValue - postValue,
      improvementPercent: baselineValue > 0 ? ((baselineValue - postValue) / baselineValue) * 100 : 0,
      probabilities: {
        baseline,
        postIntervention
      }
    };
  }

  /**
   * Calcular probabilidad conjunta
   * @param {Object} assignment - Asignación de valores a variables
   * @returns {number} Probabilidad conjunta
   */
  calculateJointProbability(assignment) {
    let probability = 1;
    
    for (const [variable, value] of Object.entries(assignment)) {
      if (!this.nodes.has(variable)) continue;
      
      const parents = this.getParents(variable);
      const parentValues = parents.map(p => assignment[p]);
      const cpt = this.getCPT(variable);
      
      // Crear clave para la CPT
      const key = parentValues.length > 0 ? parentValues.join(',') : 'root';
      
      if (cpt[key] && cpt[key][value] !== undefined) {
        probability *= cpt[key][value];
      } else {
        // Si no hay CPT definida, usar distribución uniforme
        const states = this.nodes.get(variable).states;
        probability *= 1 / states.length;
      }
    }
    
    return probability;
  }

  /**
   * Generar todas las combinaciones de valores para variables dadas
   * @param {Array} variables - Lista de variables
   * @returns {Array} Todas las combinaciones posibles
   */
  generateCombinations(variables) {
    if (variables.length === 0) return [{}];
    
    const [firstVar, ...restVars] = variables;
    const states = this.nodes.get(firstVar).states;
    const restCombinations = this.generateCombinations(restVars);
    
    const combinations = [];
    for (const state of states) {
      for (const restCombination of restCombinations) {
        combinations.push({ [firstVar]: state, ...restCombination });
      }
    }
    
    return combinations;
  }

  /**
   * Calcular valor esperado de una distribución de probabilidades
   * @param {Object} probabilities - Distribución de probabilidades
   * @returns {number} Valor esperado
   */
  calculateExpectedValue(probabilities) {
    const stateValues = { 'baja': 1, 'media': 3, 'alta': 5, 'critica': 7 };
    
    return Object.entries(probabilities).reduce((sum, [state, prob]) => {
      const value = stateValues[state] || 3; // Valor por defecto
      return sum + (value * prob);
    }, 0);
  }

  /**
   * Eliminar arcos entrantes a un nodo (para intervenciones)
   * @param {string} node - Nodo a modificar
   */
  removeIncomingArcs(node) {
    this.edges.set(node, []);
  }

  /**
   * Clonar la red bayesiana
   * @returns {BayesianNetwork} Copia de la red
   */
  clone() {
    const cloned = new BayesianNetwork();
    
    // Copiar nodos
    for (const [name, node] of this.nodes.entries()) {
      cloned.addNode(name, [...node.states], [...node.parents]);
    }
    
    // Copiar CPTs
    for (const [name, cpt] of this.cpts.entries()) {
      cloned.setCPT(name, JSON.parse(JSON.stringify(cpt)));
    }
    
    // Copiar evidencia
    for (const [node, value] of this.evidence.entries()) {
      cloned.setEvidence(node, value);
    }
    
    return cloned;
  }

  /**
   * Obtener información de la red
   * @returns {Object} Información de la red
   */
  getNetworkInfo() {
    return {
      nodes: Array.from(this.nodes.keys()),
      edges: Object.fromEntries(this.edges),
      evidence: Object.fromEntries(this.evidence),
      nodeCount: this.nodes.size,
      edgeCount: Array.from(this.edges.values()).reduce((sum, parents) => sum + parents.length, 0)
    };
  }
}

module.exports = BayesianNetwork;
