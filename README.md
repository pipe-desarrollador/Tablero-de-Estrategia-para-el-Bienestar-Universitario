# 🎯 Tablero de Estrategia para el Bienestar Universitario

## 📋 Descripción General

El **Tablero de Estrategia para el Bienestar Universitario** es un sistema de soporte a la decisión (DSS) diseñado para ayudar a la administración universitaria a tomar decisiones informadas sobre la asignación de recursos para programas de bienestar y apoyo estudiantil. El sistema transforma los datos de encuestas en conocimiento útil y práctico, facilitando acciones concretas para mejorar la experiencia y salud mental de los estudiantes.

## 🚀 Funcionalidades Clave

- **Análisis Comparativo:** Permite comparar los puntajes de estrés de la universidad con datos históricos o de otras instituciones, midiendo la efectividad de los programas de bienestar existentes.
- **Exploración de Factores Clave:** Visualizaciones interactivas (gráficos de barras, burbujas, etc.) para identificar los factores que más afectan a los estudiantes, como "problemas de sueño" o "preocupación por la futura carrera".
- **Análisis "What-If":** Simulación del impacto de diferentes inversiones en programas de bienestar (por ejemplo, ver cómo una mayor inversión en tutoría académica podría reducir el estrés).
- **Toma de Decisiones Basada en Evidencia:** El sistema guía a los líderes universitarios para redirigir recursos hacia los programas más efectivos, basándose en los datos y análisis presentados.

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por tres subsistemas principales:

1. **Subsistema de Datos (Data Subsystem):**  
   - Gestión y almacenamiento de datos en PostgreSQL.
   - Carga y procesamiento de archivos CSV con estructura definida.
2. **Subsistema de Modelos (Model Subsystem):**  
   - Procesamiento y análisis de datos para generar estadísticas y simulaciones "what-if".
   - Lógica para comparar factores y calcular impactos hipotéticos.
3. **Subsistema de Interfaz de Usuario (User Interface Subsystem):**  
   - Tablero visual e interactivo para la exploración y análisis de datos.
   - Visualizaciones claras y usables, aplicando principios de ergonomía y usabilidad.

### Estilos y Usabilidad
Un checklist de estilos y usabilidad se encuentra en `docs/style-checklist.md`.

### Modelo Entidad-Relación (MER)
El MER se encuentra en `docs/mer/` (añadir imagen `mer.png`).

## 🛠️ Tecnologías Utilizadas

- **Node.js** y **Express.js** (Backend/API RESTful)
- **PostgreSQL** (Base de datos relacional)
- **Swagger** (Documentación interactiva de la API)
- **Multer** y **csv-parser** (Carga y procesamiento de archivos CSV)
- **Vite** y **React** (Frontend moderno y rápido)
- **Herramientas de versionamiento:** Git (para código y scripts de base de datos)

## 📦 Instalación y Puesta en Marcha

### Prerrequisitos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [URL-REPOSITORIO]
    cd [URL-REPOSITORIO]

   ```

2. **Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Configurar base de datos:**
   - Crear base de datos PostgreSQL llamada `stress_db`
   - Usuario: `postgres`
   - Contraseña: `His-Password`
   - Puerto: `5432`

## 🌐 Endpoints de la API

- **POST `/api/upload-dataset`**: Cargar y procesar archivo CSV.
- **GET `/api/stats`**: Obtener estadísticas de la base de datos.
- **GET `/api/table-structure`**: Ver estructura de las tablas.
- **DELETE `/api/clear-data`**: Limpiar todos los datos.
- **GET `/api-docs`**: Documentación Swagger interactiva.

La API está documentada con Swagger y permite cargar archivos con la estructura proporcionada.

## 🧩 Requerimientos Adicionales

- El sistema es visualmente claro, fácil de usar y aplica conceptos de ergonomía y usabilidad.
- Se utiliza una metodología básica de desarrollo de sistemas de información, con planificación y seguimiento documentados.
- Se emplean herramientas de versionamiento para el código y scripts de base de datos.
- Flujo Git: `main` (producción), `develop` (integración), `feature/*` (nuevas funcionalidades). Se recomiendan Conventional Commits.
- Se siguen estándares de codificación adecuados.
- No se requiere inicio de sesión, autenticación de usuarios, roles ni perfiles.

## 📁 Estructura de Datos

La estructura de la base de datos y los archivos soportados se mantiene como en la versión anterior (ver sección original para detalles).

## 🤝 Colaboración

- **Base URL (Local):** `http://localhost:3000`
- **Base URL (Producción):** `https://nodejs-production-42b9.up.railway.app`
- **Documentación:** `/api-docs`
- **Endpoints principales:** `/api/upload-dataset`, `/api/stats`, `/api/factores-clave`, `/api/compare/likert-ge4`, `/api/what-if`
- **Formato de respuesta:** JSON estándar
- **Soporte:** Abre issues o contacta vía GitHub del proyecto.

## 📄 Licencia

Este proyecto es parte del trabajo académico sobre análisis de estrés estudiantil.

---

## 📚 Documentación del Proyecto
- Documento detallado del proyecto: [`docs/Documento_Proyecto.md`](docs/Documento_Proyecto.md)
- Manual de usuario ampliado: [`MANUAL_USUARIO.md`](MANUAL_USUARIO.md)
- Swagger (API): `http://localhost:3000/api-docs`

## 🌐 Demostración en Vivo

**¡Prueba la aplicación sin instalar nada!**

- **🚀 Aplicación Web:** [Ver Demo en Vivo](https://tablero-bienestar.vercel.app) ✅ **¡FUNCIONANDO!**
- **📚 API Docs:** [Documentación Interactiva](https://nodejs-production-42b9.up.railway.app/api-docs) ✅ **¡FUNCIONANDO!**
- **📊 Datos de Prueba:** Incluye dataset de demostración con 20+ registros realistas

### 🎯 Características de la Demo
- ✅ **Datos Pre-cargados:** Dataset de demostración con estudiantes de diferentes perfiles
- ✅ **Análisis Completo:** Todas las funcionalidades disponibles para probar
- ✅ **Simulaciones What-If:** Prueba diferentes escenarios de intervención
- ✅ **Análisis Bayesiano:** Explora las probabilidades de éxito de las intervenciones
- ✅ **Sin Registro:** Acceso inmediato sin necesidad de crear cuenta

### 🛠️ Para Desarrolladores
Si prefieres ejecutar localmente, sigue la [Guía de Instalación](#-instalación-y-puesta-en-marcha) o consulta la [Guía de Despliegue](deploy-guide.md) para crear tu propia instancia.

## 🐛 Correcciones Recientes

### v1.1.0 - Corrección de Bug NaN% en Contribución
- **Problema:** El campo "Contribución" mostraba "NaN%" en lugar de un porcentaje válido
- **Causa:** División por `undefined` cuando `totalWeight` no estaba definido en el análisis con datos reales del backend
- **Solución:** 
  - Asegurado que `totalWeight` y `maxPossible` se calculen en ambos casos (datos reales y simulados)
  - Agregada validación para evitar división por cero
  - Mejorada la lógica de cálculo de contribución con manejo de casos edge
- **Archivos modificados:** `frontend/src/components/RealTimeBayesianAnalysis.jsx`

### v1.2.0 - Deployment en Producción
- **Frontend:** Desplegado exitosamente en Vercel
- **Backend:** Desplegado exitosamente en Railway con PostgreSQL
- **Demo en Vivo:** Disponible para pruebas sin instalación local
- **URLs de Producción:** Actualizadas en documentación

---

**Desarrollado con ❤️ para el análisis y mejora del bienestar universitario**
