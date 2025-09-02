# 🚀 Guía de Desarrollo - Backend

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Configuración Inicial

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar base de datos:**
   - Crear base de datos PostgreSQL: `stress_db`
   - Configurar credenciales en `server.js` (líneas 50-56)

3. **Variables de entorno (opcional):**
   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

## 🏃‍♂️ Comandos de Desarrollo

### Scripts Disponibles

```bash
# Iniciar servidor en modo desarrollo
npm run dev

# Iniciar servidor en producción
npm start

# Ejecutar tests unitarios
npm test

# Verificar calidad de código (ESLint + Tests + KPIs)
npm run quality-check

# Solo verificar ESLint
npm run lint

# Corregir errores de ESLint automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format

# Verificar formato sin cambiar archivos
npm run format:check
```

## 📊 Verificación de Calidad

### ESLint
- Configurado para Windows (linebreak-style: windows)
- Reglas relajadas para desarrollo
- Archivos de test y debugging excluidos

### Tests Unitarios
- 30 pruebas automatizadas
- Cobertura de funciones principales
- Ejecutar con: `npm test`

### KPIs de Calidad
- Cobertura de endpoints: 100%
- Tasa de errores críticos: 0%
- Rendimiento API: <500ms
- Calidad de código: >90%
- Mantenibilidad: >4/5

## 🏗️ Estructura del Proyecto

```
backend/
├── server.js              # Servidor principal
├── kpi-checker.js         # Verificador de KPIs
├── utils.js               # Funciones utilitarias
├── logger.js              # Sistema de logging
├── middleware/
│   └── errorHandler.js    # Manejo de errores
├── tests/
│   └── unit-tests.js      # Tests unitarios
├── scripts/
│   └── quality-check.js   # Script de calidad
├── .eslintrc.js           # Configuración ESLint
├── .eslintignore          # Archivos ignorados por ESLint
└── package.json           # Dependencias y scripts
```

## 🔧 Configuración de ESLint

### Reglas Principales
- **Indentación:** 2 espacios
- **Comillas:** Simples
- **Punto y coma:** Obligatorio
- **Linebreaks:** Windows (CRLF)
- **Complejidad:** Máximo 20
- **Líneas por función:** Máximo 100

### Excepciones
- `kpi-checker.js`: Permite console.log
- `tests/`: Reglas relajadas
- Archivos de configuración: Ignorados

## 🐛 Debugging

### Logs
- Los logs se guardan en `logs/`
- Nivel de log configurable por entorno
- Errores de API logueados automáticamente

### Console.log
- Permitido en `kpi-checker.js`
- Para otros archivos, usar el sistema de logging

## 📈 Monitoreo

### Endpoints de Salud
- `GET /ping` - Health check básico
- `GET /_routes` - Lista de rutas disponibles

### Métricas
- Tiempo de respuesta promedio
- Tasa de errores
- Uso de memoria
- Conexiones de base de datos

## 🚀 Despliegue

### Producción
1. Configurar variables de entorno
2. Ejecutar `npm run quality-check`
3. Iniciar con `npm start`

### Docker (opcional)
```bash
docker build -t stress-backend .
docker run -p 3000:3000 stress-backend
```

## 🤝 Contribución

1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Desarrollar y testear
3. Ejecutar `npm run quality-check`
4. Crear Pull Request

## 📞 Soporte

- **Autor:** Felipe - Backend Developer
- **Versión:** 1.0.0
- **Documentación API:** `http://localhost:3000/api-docs`

---

**¡Happy Coding! 🎉**
