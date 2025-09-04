#!/usr/bin/env node

/**
 * Script de verificación de calidad de código
 * Ejecuta ESLint, tests y otras verificaciones
 */

const { execSync } = require('child_process');
// const fs = require('fs'); // No utilizado actualmente
// const path = require('path'); // No utilizado actualmente

console.log('🔍 Iniciando verificación de calidad de código...\n');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completado exitosamente`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} falló`, 'red');
    return false;
  }
}

// Verificaciones a ejecutar
const checks = [
  {
    command: 'npx eslint . --ext .js',
    description: 'Verificación de ESLint'
  },
  {
    command: 'npm run test',
    description: 'Ejecución de tests unitarios'
  },
  {
    command: 'node kpi-checker.js',
    description: 'Verificación de KPIs'
  }
];

let allPassed = true;

// Ejecutar cada verificación
for (const check of checks) {
  const passed = runCommand(check.command, check.description);
  if (!passed) {
    allPassed = false;
  }
}

// Resumen final
console.log(`\n${'='.repeat(50)}`);
if (allPassed) {
  log('🎉 ¡Todas las verificaciones de calidad pasaron!', 'green');
  process.exit(0);
} else {
  log('⚠️  Algunas verificaciones fallaron. Revisa los errores arriba.', 'yellow');
  process.exit(1);
}
