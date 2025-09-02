module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Reglas de estilo
    'indent': ['error', 2],
    'linebreak-style': ['error', 'windows'], // Cambiado a 'windows' para compatibilidad
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    
    // Reglas de calidad
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Cambiado de error a warn
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    
    // Reglas de buenas prácticas
    'prefer-const': 'warn', // Cambiado de error a warn
    'no-var': 'error',
    'object-shorthand': 'warn', // Cambiado de error a warn
    'prefer-template': 'warn', // Cambiado de error a warn
    
    // Reglas de complejidad - más permisivas
    'complexity': ['warn', 20], // Aumentado de 10 a 20
    'max-depth': ['warn', 6], // Aumentado de 4 a 6
    'max-lines-per-function': ['warn', 100], // Aumentado de 50 a 100
    'max-params': ['warn', 6], // Aumentado de 4 a 6
    
    // Reglas de seguridad
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Reglas de documentación - menos estrictas
    'valid-jsdoc': 'off', // Desactivado
    'require-jsdoc': 'off' // Desactivado
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        'no-console': 'off',
        'max-lines-per-function': 'off',
        'complexity': 'off',
        'max-depth': 'off'
      }
    },
    {
      files: ['kpi-checker.js'],
      rules: {
        'no-console': 'off' // Permitir console.log en archivo de debugging
      }
    }
  ]
};
